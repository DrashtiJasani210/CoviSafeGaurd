<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Send Mail</title>
</head>
<body>
    <form method="post" action="sendMail.php">
    <table>
        <tr>
            <td>To :</td>
            <td><input type="mail" name="em" id="em"/><br/></td>
        </tr>
        <tr>
            <td>Subject : </td>
            <td><input type="text" name="sub" id="sub"/><br/></td>
        </tr>
        <tr>
            <td>Message : </td>
            <td><textarea name="msg"></textarea></td>
        </tr>
        <tr>
           <td></td>
           <td><input type="submit" value="Submit" name="submit"/></td> 
        </tr>
    </table>
    </form>
</body>
</html>
<?php
    if(isset($_POST["submit"]))
    {
        $header = "From: drstvjasani@gmail.com";
        if(mail($_POST['em'],$_POST['sub'],$_POST['msg'],$header))
        {
            echo "Mail sent Successfully....";
        }
        else{
            echo "Mail failed..";
        }
    }
?>