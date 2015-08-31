<?php

require_once 'connection.php';

// CREATE TABLE gamescore( id integer primary key autoincrement, level text not null , name text not null , score integer , time timestamp default (strftime('%s', 'now')) );
// insert into gamescore ( level , name , score ) values ( "anon" , "hai" , 666 )
$return_object = array();
$return_object["status"] = "init";
$return_object["msg"] = array();
$return_object["data"] = array();

if( $db_handle === false )
{
    // Database connection has failed.
    $return_object["status"] = "database_failed";
    echo json_encode( $return_object );
    exit();
}

// level
$level = "anon";
if( isset( $_POST['level'] ) )
{
    $level = trim( substr( $_POST['level'] , 0 , 32 ) );
}
$level = base64_encode( $level );

function act( $action )
{
    global $return_object;
    global $db_handle;
    global $level;
    
    if( $action == 'addscore' )
    {
        if( isset($_POST['name']) && isset($_POST['score']) )
        {
            $name = trim( substr( $_POST['name'] , 0 , 32 ) );
            
            // linebreaks or other filth.
            $name = preg_replace("/[\r]+/", "", $name);
            $name = preg_replace("/[\n]+/", "", $name);
            $name = preg_replace("/[\t]+/", "", $name);
            
            if( $name == "" )
            {
                return;
            }
            
            $name = base64_encode( $name );
            $score = $_POST['score'];
            if( !is_numeric($score) )
            {
                return;
            }
            
            $statement = "insert into gamescore ( level , name , score ) values ( \"$level\" , \"$name\" , $score )";
            if( $db_handle->exec( $statement ) )
            {
                array_push( $return_object["msg"] , "successfully insert" );
            } 
            else 
            {
                array_push( $return_object["msg"] , "failed insert" );
                array_push( $return_object["msg"] , $db_handle->lastErrorMsg() );
            }
            return;
        }
    }
}

// Actions
if( isset( $_POST['action'] ) )
{
    act( $_POST['action'] );
}

// QUERY
$statement = "SELECT name,score FROM gamescore WHERE level = \"$level\" ORDER BY score DESC LIMIT 6";
$result = $db_handle->query( $statement );
while( $row = $result->fetchArray( SQLITE3_ASSOC ) ) 
{
    array_push( $return_object["data"] , array( 'name' => base64_decode( $row['name'] ) , 'score' => $row['score'] ) );
}

$return_object["status"] = "ok";
echo json_encode( $return_object );