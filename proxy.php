<?php
header('Content-type: application/json');

require_once('lib/jsonRPCClient.php');

$url='http://192.168.0.92:8080/jsonrpc';
$client = new jsonRPCClient($url,true);

$method = $_REQUEST['method'];
$getParams =  isset( $_REQUEST['params'] ) ? $_REQUEST['params'] : array();
$result = $client->call($method, $getParams);

// return the results
echo json_encode($result);
