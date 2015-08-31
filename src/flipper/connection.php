<?php

// start the session
//session_start()

$db_file = 'data.sqlite';

$db_handle = false;
if( file_exists( $db_file ) ) 
{
    $db_handle = new SQLite3( $db_file );
}

//if( $db_handle === false ) 
//{
//    echo "// database present, but failed to open, quit\nfile " . $db_file;
//    exit();
//} 

