Suggested backend patch for `projects.php`

Problem:
- A fatal PHP error occurs during MySQL connection on Render: `No such file or directory` from `mysqli` constructor.
- The PHP fatal error produces HTML output which the frontend tries to parse as JSON and fails.

Goals:
1. Make the PHP endpoint return a JSON error response when DB connection fails (so frontend shows a friendly message).
2. Make the DB connection robust for Render (use host/port instead of socket, or use environment variables Render provides).

Patch outline (replace the DB connection section around the mysqli constructor):

```php
// Example robust DB connection (replace existing connection code)
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$name = getenv('DB_NAME') ?: 'my-portfolio';
$port = getenv('DB_PORT') ?: 3306; // use TCP port instead of socket when appropriate

$mysqli = null;
try {
    // Prefer TCP connection using host + port to avoid missing socket errors on Render
    $mysqli = new mysqli($host, $user, $pass, $name, (int)$port);
    if ($mysqli->connect_errno) {
        throw new Exception('DB connection failed: ' . $mysqli->connect_error);
    }
    // set charset
    $mysqli->set_charset('utf8mb4');
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([ 'error' => 'Database connection error', 'detail' => $e->getMessage() ]);
    exit;
}
```

Notes and steps to apply on Render server:
- Edit `/var/www/html/php/projects.php` (or wherever your PHP files live) and replace the raw `new mysqli(...)` call with the snippet above.
- Make sure Render environment variables are configured (via the Render dashboard) for `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, and optionally `DB_PORT` if your DB isn't using the default.
- If you're using a managed database on Render, use the provided host/port credentials rather than `localhost` or a socket path.
- After editing, test the endpoint directly:

```bash
curl -i 'https://myportfolio-amie.onrender.com/php/projects.php?id=2' -X DELETE
```

Expected result after fix:
- On DB connection failure, endpoint returns HTTP 500 with JSON body: `{"error":"Database connection error","detail":"..."}`
- Frontend will receive valid JSON and show a helpful error message instead of "not valid json".

Optional: add a global exception handler to convert uncaught exceptions into JSON responses so other fatal errors are handled similarly.

If you want, I can prepare a full patch file (diff) that you can apply on the server or submit to your repo. Let me know.