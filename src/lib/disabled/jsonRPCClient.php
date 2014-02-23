<?php
/**
 * jsonRPCClient.php
 *
 * Written using the JSON RPC specification -
 * http://json-rpc.org/wiki/specification
 *
 * @author Kacper Rowinski <krowinski@implix.com>
 * http://implix.com
 */
class jsonRPCClient
{
  protected $url = null, $is_debug = false, $parameters_structure = 'array';

  // default options for curl
  protected $curl_options = array(
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_TIMEOUT => 8
  );

  // http errors - more can be found at
  // http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  public $http_errors = array
  (
    400 => '400 Bad Request',
    500 => '500 Internal Server Error'
  );

  /**
   * Takes the connection parameter and checks for extentions
   *
   * @param string $url - url name like http://example.com/
   * @return void
   */
  public function __construct($url)
  {
    $validateParams = array
    (
      false === extension_loaded('curl') => 'The curl extension must be loaded for using this class !',
      false === extension_loaded('json') => 'The json extension must be loaded for using this class !'
    );
    $this->checkForErrors($validateParams);

    // set an url to connect to
    $this->url = $url;
  }

  /**
   * Set debug mode
   *
   * @param boolean $is_debug
   * @return void
   */
  public function setDebug($is_debug)
  {
    $this->is_debug = !empty($is_debug);
  }

  /**
   * Set structure to use for parameters
   *
   * @param string $parameters_structure 'array' or 'object'
   * @return void
   */
  public function setParametersStructure($parameters_structure)
  {
    if (in_array($parameters_structure, array('array', 'object')))
    {
      $this->parameters_structure = $parameters_structure;
    }
    else
    {
      throw new Exception('Invalid parameters structure type.');
    }
  }

  /**
   * Set extra options for curl connection
   * @param array $options_array
   */
  public function setCurlOptions($options_array)
  {
    if (is_array($options_array))
    {
      $this->curl_options = $options_array + $this->curl_options;
    }
    else
    {
      throw new Exception('Invalid options type.');
    }
  }

  /**
   * Performs a request and gets the results
   *
   * @param string $method - A String containing the name of the method to be invoked.
   * @param array $params - An Array of objects to pass as arguments to the method.
   * @return array
   */
  public function call($method, $params)
  {
    static $requestId;

    // generating uniuqe id per process
    $requestId++;

    // check if given params are correct
    $validateParams = array
    (
      false === is_scalar($method) => 'Method name has no scalar value',
      false === is_array($params) => 'Params must be given as array'
    );
    $this->checkForErrors($validateParams);

    // $params['sessid'] = session_id();

    // send params as an object or an array
    $params = ($this->parameters_structure == 'object') ? $params[0] : array_values($params);

    // Request (method invocation)
    $request = json_encode(array('jsonrpc' => '2.0', 'method' => $method, 'params' => $params, 'id' => $requestId));
//print $request;
    // if is_debug mode is true then add url and request to is_debug
    $this->debug('Url: ' . $this->url . "\r\n", false);
    $this->debug('Request: ' . $request . "\r\n", false);

    $response = $this->getResponse($request);

    // if is_debug mode is true then add response to is_debug and display it
    $this->debug('Response: ' . $response . "\r\n", true);

    // decode and create array ( can be object, just set to false )
    $response = json_decode($response, true);

    // check if response is correct
    $validateParams = array
    (
      $response['id'] != $requestId => 'Request id: '.$requestId.' is different from Response id: ' . $response['id'],

    );
    if (isset($response['error']))
    {
      $error_message = 'Request have return error: ' . $response['error']['message'] . '; ' . "\n" .
        'Request: ' . $request . '; ';

      if (isset($response['error']['data']))
      {
        $error_message .= "\n" . 'Error data: ' . $response['error']['data'];
      }

      $validateParams[ !is_null($response['error'])] = $error_message;
    }

    $this->checkForErrors($validateParams);

    return $response['result'];
  }

  /**
   * When the method invocation completes, the service must reply with a response.
   * The response is a single object serialized using JSON
   *
   * @param string $request
   * @return string
   */
  protected function & getResponse(& $request)
  {
    // do the actual connection
    $ch = curl_init();
    // set URL
    curl_setopt($ch, CURLOPT_URL, $this->url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
    curl_setopt($ch, CURLOPT_ENCODING, 'gzip,deflate');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    //cookies required for auth, save to tmp folder @added by Jeremy
    $base = sys_get_temp_dir() . '/';
    curl_setopt($ch, CURLOPT_COOKIEJAR, $base . "tb_deluge_cook.txt");
    curl_setopt($ch, CURLOPT_COOKIEFILE, $base . "tb_deluge_cook.txt");

    curl_setopt_array($ch, $this->curl_options);
    // send the request
    $response = curl_exec($ch);
    // check http status code
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if (isset($this->http_errors[$http_code]))
    {
      throw new Exception('Response Http Error - ' . $this->http_errors[$http_code]);
    }
    // check for curl error
    if (0 < curl_errno($ch))
    {
      throw new Exception('Unable to connect to '.$this->url . ' Error: ' . curl_error($ch));
    }
    // close the connection
    curl_close($ch);
    return $response;
  }

  /**
   * Check for errors
   *
   * @param array $validateArray
   * @return void
   */
  protected function checkForErrors(& $validateArray)
  {
    foreach ($validateArray as $test => $error)
    {
      if ($test)
      {
        throw new Exception($error);
      }
    }
  }

  /**
   * For is_debug and performance stats
   *
   * @param string $add
   * @param boolean $show
   * @return void
   */
  protected function debug($add, $show = false)
  {
    static $debug, $startTime;
    // is_debug off return
    if (false === $this->is_debug)
    {
      return;
    }
    // add
    $debug .= $add;
    // get starttime
    $startTime = empty($startTime) ? array_sum(explode(' ', microtime())) : $startTime;
    if (true === $show and !empty($debug))
    {
      // get endtime
      $endTime = array_sum(explode(' ', microtime()));
      // performance summary
      $debug .= 'Request time: ' . round($endTime - $startTime, 3) . ' s Memory usage: ' . round(memory_get_usage() / 1024) . " kb\r\n";
      // echo nl2br($debug);
      // send output imidiately
      //flush();
      // clean static
      //dsm($debug);
      $debug = $startTime = null;
      //dsm($debug);
    }
  }
}
