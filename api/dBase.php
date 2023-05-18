<?php
/**
 * User: Muhammed Asif */
/**
 * Description of dBase
 *
 * @author AA
 */
date_default_timezone_set("Asia/Dubai");
class dBase
{


    public $con;
    private $server;
    private $user;
    private $pass;
    private $db;
    private $msgType;
    private $msgText;

    // public $result;

    // function __construct($server = "127.0.0.1", $user = "root", $pass = "", $db = "customer_portal", $con = "")
    function __construct($server = "localhost", $user = "ireproperty_aj", $pass = 'AA123456', $db = "ireproperty_portal" ,$con="")

    {
        $this->server = $server;
        $this->user = $user;
        $this->pass = $pass;
        $this->db = $db;
        $this->con = mysqli_connect($this->server, $this->user, $this->pass);
    }

    public function execute($query)
    {
        $this->open();

        $result = mysqli_query($this->con, $query) or die(" " . mysqli_error($this->con));
        $this->close();
        return $result;
    }

    public function open()
    {
        $this->con = mysqli_connect($this->server, $this->user, $this->pass);
        if (!$this->con) {
            $this->msgText = 'Not connected : ' . mysqli_error($this->con);
            $this->msgType = "Error";
        }

        $db_selected = mysqli_select_db($this->con, $this->db);
        if (!$db_selected) {
            $this->msgText = 'Can\'t use database : ' . mysqli_error($this->con);
            $this->msgType = "Error";
        }
    }

    public function getNextId($table, $id)
    {
        $this->open();
        $query = "select ifnull(MAX(id),0) from " . $table;
        $result = mysqli_query($this->con, $query);
        if ($result != "") {
            while ($row = mysqli_fetch_array($result)) {
                $id = $row[0];
            }
        }
        $this->close();
        return $id + 1;
    }

    public function close()
    {
        $this->con = mysqli_connect($this->server, $this->user, $this->pass);
        mysqli_close($this->con);
    }

    public function Count($query)
    {
        $this->open();
        $sql = mysqli_num_rows($query);

        $this->close();
        return $sql;
    }

    public function CountQuery($CountQuery)
    {
        $CountQuery_q = $this->execute($CountQuery);
        $sql = mysqli_num_rows($CountQuery_q);
        return $sql;
    }


    //insert into user_course

    public function insert($postedarray, $table)
    {
        $this->open();
        $columns = '';
        $data = '';
        //$postedarray['creation_date']=  date("Y/m/d");
        foreach ($postedarray as $key => $val) {
            if ($key != 'mod' && $key != 'submit' && $key != 'id' && $key != 'awas_btn_add') {

                $columns .= ',' . $key;
                $data .= ',' . "'" . mysqli_real_escape_string($this->con, $val) . "'";
            }
        }

        $primary_get = mysqli_fetch_array($this->execute("SHOW INDEX FROM " . $table . " where `Key_name` = 'PRIMARY'"));
        $primary_name = $primary_get['Column_name'];

        $primary_id = $this->getNextId($table, $primary_name);

        $query = "INSERT INTO " . $table . " ($primary_name $columns) VALUES($primary_id  $data)";

        $this->execute($query);

        if (@mysqli_error($this->con) == "") {
            $this->setMsgType("Success");
            $this->setMsgText("Inserted successfully");
        } else {
            $this->setMsgType("Error");
            $this->setMsgText("could not Inserted !");
        }
        $this->close();
        return $primary_id;
    }

    public function execute_return_id($query)
    {
        $this->open();
        $result = mysqli_query($this->con, $query) or die(" " . mysqli_error($this->con));
        return mysqli_insert_id($this->con);
        $this->close();
    }

    public function update($postedarray, $table, $unique_id)
    {

        $this->open();
        foreach ($postedarray as $key => $val) {
            if ($key != 'mod' && $key != 'submit' && $key != 'id' && $key != 'awas_btn_add') {
                $columns[] = $key;
                $data[] = mysqli_real_escape_string($this->con, $val);
            }
        }


        $queryvalue = '';

        for ($i = 0; $i < count($columns); $i++) {

            if ($i == 0) {
                $queryvalue = "$columns[$i]='$data[$i]'";
            } else {

                $queryvalue .= "," . "$columns[$i]='$data[$i]'";
            }
        }
        $primary_get = mysqli_fetch_array($this->execute("SHOW INDEX FROM " . $table . " where `Key_name` = 'PRIMARY'"));
        $primary_name = $primary_get['Column_name'];

        $query = "UPDATE  " . $table . " SET  " . $queryvalue . "  WHERE  " . $primary_name . " = '" . $unique_id . "';";

        $this->execute($query);
        if (@mysqli_error($this->con) == "") {
            $this->setMsgType("Success");
            $this->setMsgText(" updated successfully");
        } else {
            $this->setMsgType("Error");
            $this->setMsgText(" could not update !");
        }
        $this->close();
    }


    public function getMsgType()
    {
        return $this->msgType;
    }

    public function setMsgType($msgType)
    {
        $this->msgType = $msgType;
    }

    public function getMsgText()
    {
        return $this->msgText;
    }

    public function setMsgText($msgText)
    {
        $this->msgText = $msgText;
    }



    function getUserIP()
    {
        $client = @$_SERVER['HTTP_CLIENT_IP'];
        $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
        $remote = $_SERVER['REMOTE_ADDR'];

        if (filter_var($client, FILTER_VALIDATE_IP)) {
            $ip = $client;
        } elseif (filter_var($forward, FILTER_VALIDATE_IP)) {
            $ip = $forward;
        } else {
            $ip = $remote;
        }

        return $ip;
    }

    function runQuery($query)
    {
        $this->open();

        // $result= mysqli_query($this->con, $query) or die(" " . mysqli_error($this->con));

        $result = mysqli_query($this->con, $query) or die(" " . mysqli_error($this->con));
        while ($row = mysqli_fetch_assoc($result)) {
            $resultset[] = $row;
        }
        if (!empty($resultset))
            return $resultset;
    }

    function getany_val($getany_val_v1, $getany_val_v2, $getany_val_v3, $getany_val_v4)
    {
        $getany_val_f = $this->queryto_fetch("SELECT `$getany_val_v1` FROM `$getany_val_v2` WHERE `$getany_val_v3`='$getany_val_v4' ");
        return $getany_val_f[$getany_val_v1];
    }



    function queryToWhile($queryToWhile_v1)
    {
        $queryToWhile_r = $this->execute($queryToWhile_v1);
        while ($queryToWhile_f[] = mysqli_fetch_array($queryToWhile_r)) {
        }
        return $queryToWhile_f;
    }

    function queryToWhile_2($query)
    {
        $e = $this->execute($query);
        while ($f[] = mysqli_fetch_assoc($e)) {
        }
        return $f;
    }

    function queryto_fetch($queryto_fetch_v1)
    {
        $queryto_fetch_r = $this->execute($queryto_fetch_v1);
        $queryto_fetch_f = mysqli_fetch_array($queryto_fetch_r);
        return array_filter($queryto_fetch_f);
    }

    function queryto_fetch_assoc($queryto_fetch_v1)
    {
        $queryto_fetch_r = $this->execute($queryto_fetch_v1);
        $queryto_fetch_f = mysqli_fetch_assoc($queryto_fetch_r);
        return array_filter($queryto_fetch_f);
    }


    function queryto_fetch_api($queryto_fetch_v1)
    {
        $queryto_fetch_r = $this->execute($queryto_fetch_v1);
        $queryto_fetch_f = mysqli_fetch_array($queryto_fetch_r);
        return $queryto_fetch_f;
    }


}