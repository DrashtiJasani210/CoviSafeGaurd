<?php
    require 'contact.html';
    $conn = mysql_connect("localhost","root","");
    if(!$conn)
    {
        die("Could not connect".mysql_error());
    } 
    if(isset($_POST['submit']))
    {
        mysql_select_db("covisafegaurd");
        $u_name = $_POST['u_name'];
        $u_mail = $_POST['u_mail'];
        if(isset($_POST['subscribe']))
        {
            $subscribe = 1;
        }
        else{
            $subscribe = 0;
        }
    
        if($u_name=="")
        {
            echo("
                <script>
                    var alert = document.getElementById('alert');
                    alert.innerHTML = 'Enter your name.';
                    alert.style.visibility = 'visible';
                    alert.classList.add('alert-danger');
                </script>
            ");
        }
        else if($u_mail=="")
        {
            echo("
                <script>
                    var alert = document.getElementById('alert');
                    alert.innerHTML = 'Enter your Email.';
                    alert.style.visibility = 'visible';
                    alert.classList.add('alert-danger');
                </script>
            ");
        }
        else{
            $ret = mysql_query("INSERT INTO `user_details` (`user_name`, `user_mail`, `subscribe`) VALUES ('$u_name', '$u_mail', $subscribe);",$conn);
            if($ret)
            {
                if($subscribe==1){
                    echo("
                        <script>
                            var alert = document.getElementById('alert');
                            alert.innerHTML = 'You registered successfully. We will provide you latest updates of covid-19 regularly.';
                            alert.style.visibility = 'visible';
                            alert.classList.add('alert-success');
                        </script>
                    ");
                    
                    $headers = "Content-type: text/html\r\n"."From: CoviSafeGaurd <covisafegaurd@gmail.com>";
                    $sub = "Welcome to CovisafeGaurd";
                    $msg = "<html>
                    <body>
                        <h3>Thank you.. ".$u_name."</h3><p>You are currently registered to our site. We will send you latest updates of covid-19
                            regularly.</p>
                    </body>
                    </html>";
                    mail($u_mail,$sub,$msg,$headers);
                }
                else{
                    echo("
                        <script>
                            var alert = document.getElementById('alert');
                            alert.innerHTML = 'You regestered successfully';
                            alert.style.visibility = 'visible';
                            alert.classList.add('alert-success');
                        </script>
                    ");
                }
            }
            else{
                echo("
                <script>
                    var alert = document.getElementById('alert');
                    alert.innerHTML = 'You are already registered.';
                    alert.style.visibility = 'visible';
                    alert.classList.add('alert-warning');
                </script>
            ");
            }
        }
        unset($_POST['submit']);
        
    }
    mysql_close($conn);
?>