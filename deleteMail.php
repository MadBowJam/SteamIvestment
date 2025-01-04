<?php

if (php_sapi_name() !== 'cli') {
    die("Access Denied: This script can only be run from the command line.\n");
}

$options = getopt('', [
    'hostname::',
    'port::',
    'ssl::',
    'username:',
    'password:',
    'folders::',
    'from-date::',
    'to-date:',
]);

$hostname = isset($options['hostname']) ? $options['hostname'] : 'mail.adm.tools';
$port = isset($options['port']) ? $options['port'] : 143;
$username = $options['username'] ?? die("Error: 'username' parameter is required.\n");
$password = $options['password'] ?? die("Error: 'password' parameter is required.\n");
$ssl = isset($options['ssl']) ? $options['ssl'] : (($port == 993) ? 'y' : 'n');

$folders = isset($options['folders']) ? explode(',', $options['folders']) : ['INBOX'];
$fromDate = isset($options['from-date']) ? $options['from-date'] : '1-Jan-1970';
if (!isset($options['to-date'])) {
    die("Error: 'to-date' parameter is required.\n");
}
$toDate = $options['to-date'];

$connectionString = '{' . $hostname . ':' . $port . (($ssl == 'y') ? '/imap/ssl' : '/imap') . '}';

echo "Connecting to server: $connectionString\n";
echo "Searching emails in folders: " . implode(', ', $folders) . "\n";

foreach ($folders as $folder) {
    $fullFolderName = (stripos($folder, 'INBOX') === 0) ? $folder : 'INBOX.' . $folder;
    $imapStream = imap_open($connectionString . $fullFolderName, $username, $password);

    if (!$imapStream) {
        echo "Error: Could not open folder $fullFolderName\n";
        continue;
    }

    $searchCriteria = 'SINCE "' . $fromDate . '" BEFORE "' . $toDate . '"';
    $emails = imap_search($imapStream, $searchCriteria);

    if ($emails) {
        echo "Found " . count($emails) . " emails in folder $fullFolderName\n";

        foreach ($emails as $emailNumber) {
            $deleteStatus = imap_delete($imapStream, $emailNumber);
            if ($deleteStatus) {
                echo "Successfully deleted email with ID $emailNumber in folder $fullFolderName\n";
            } else {
                echo "Error deleting email with ID $emailNumber in folder $fullFolderName\n";
            }
        }

        imap_expunge($imapStream);
    } else {
        echo "No emails found in folder $fullFolderName matching criteria\n";
    }

    imap_close($imapStream);
}

echo "Done.\n";