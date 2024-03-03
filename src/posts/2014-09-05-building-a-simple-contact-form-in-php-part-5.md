---
layout: blog.njk
slug: building-a-simple-contact-form-in-php-part-5
title: Building a simple contact form in PHP - Part 5
date: 2014-09-05
published: true
sharing: true
comments: true
image: "assets/images/featured/contact-form.png"
image_width: 470
image_height: 420
excerpt: Using Swift to send email notifications on contact form submissions.
first: /2014/09/building-a-simple-contact-form-in-php-part-1/
last: /2014/09/building-a-simple-contact-form-in-php-part-5/
prev: /2014/09/building-a-simple-contact-form-in-php-part-4/
categories: [php, mail]
---

In [part 4](/2014/09/building-a-simple-contact-form-in-php-part-4/) of [Building a simple contact form in PHP](/2014/09/building-a-simple-contact-form-in-php-part-1/) we added a CAPCHA field to help reduce spam.

In this part we are going to change the sending of the mail to use SMTP by using [Swift Mailer](http://swiftmailer.org/), a php mailing library.

<!--more-->

As we left it our contact form looked like this.

```php
<?php

require_once(__DIR__ . '/recaptcha-php-1.11/recaptchalib.php');

$valid = true;
$errors = array();
$captchaerror = null;

// Load config file
$config = include(__DIR__ . '/config.php');

$contact = array(
    'name' => null,
    'email' => null,
    'message' => null
);

// Check if the form has been posted
if (isset($_POST['recaptcha_challenge_field'],$_POST['recaptcha_response_field'])) {
    $resp = recaptcha_check_answer(
        $config['recaptcha']['privatekey'],
        $_SERVER["REMOTE_ADDR"],
        $_POST["recaptcha_challenge_field"],
        $_POST["recaptcha_response_field"]
    );

    if (!$resp->is_valid) {
        $captchaerror = $resp->error;
        $valid = false;
        $errors['captcha'] = "Entered text did not match.";
    }

    $contact = filter_input_array(INPUT_POST, array(
        'name'   => FILTER_SANITIZE_STRING,
        'email'   => FILTER_SANITIZE_STRING,
        'message'   => FILTER_SANITIZE_STRING,
    ), true);
    if (empty($contact['name'])) {
        $valid = false;
        $errors['name'] = "You must enter your name.";
    }
    if (empty($contact['email'])) {
        $valid = false;
        $errors['email'] = "You must enter your email address.";
    } elseif (!filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)) {
        $valid = false;
        $errors['email'] = "You must enter a valid email address.";
    }
    if (empty($contact['message'])) {
        $valid = false;
        $errors['message'] = "You must enter a message.";
    }

    if ($valid) {
        // The email address the email will be sent to
        $to = "business@example.com";
        // The email subject
        $subject = "Contact Form Submission";
        // Set the from and reply-to address for the email
        $headers = "From: website@example.com\r\n"
                 . "Reply-To: " . $contact['email'] . "\r\n"
                 . "X-Mailer: PHP/" . phpversion();
        // Build the body of the email
        $mailbody = "The contact form has been filled out.\n\n"
                  . "Name: " . $contact['name'] . "\n"
                  . "Email: " . $contact['email'] . "\n"
                  . "Message:\n" . $contact['message'];
        // Send the email
        mail($to, $subject, $mailbody, $headers);
        // Go to the thank you page
        header("location: thankyou.html");
        exit;
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Contact Us</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <form action="contact.php" method="post" accept-charset="utf-8" data-parsley-validate novalidate>
        <fieldset>
            <legend>Contact Us</legend>
            <?php if (!$valid): ?>
                <div class="error">
                    <?php foreach($errors as $message):?>
                        <div><?php echo htmlspecialchars($message); ?></div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <div class="row">
                <label for="name">Name: </label>
                <input id="name" type="text" name="name" value="<?php echo htmlspecialchars($contact['name']);?>" required data-parsley-required-message="You must enter your name.">
            </div>
            <div class="row">
                <label for="email">Email Address: </label>
                <input id="email" type="email" name="email" value="<?php echo htmlspecialchars($contact['email']);?>" required data-parsley-required-message="You must enter your email address." parsley-type-email-message="You must enter a valid email address.">
            </div>
            <div class="row">
                <label for="message">Message:</label>
                <textarea id="message" name="message" required data-parsley-required-message="You must enter a message."><?php echo htmlspecialchars($contact['message']);?></textarea>
            </div>
            <div class="row">
                <?php echo recaptcha_get_html($config['recaptcha']['publickey'], $captchaerror); ?>
            </div>
            <div class="row">
                <input type="submit" value="Submit">
            </div>

        </fieldset>
    </form>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/parsley.js/2.0.2/parsley.min.js"></script>
</body>
</html>
```

## Add the SMTP credentials to your configuration file

```php
"mail" => array(
    "type" => "smtp",
    "server" => "smtp.gmail.com",
    "port" => 587,
    "auth" => true,
    "username" => "email@gmail.com",
    "password" => "yourgmailpassword"
)
```
I am using a gmail account as an example.  Change the server, port, username, and password to whatever the settings for your email account are.

## Adding the Swiftmailer library

Head over to the [releases page](https://github.com/swiftmailer/swiftmailer/releases) for the [github repository for the project](https://github.com/swiftmailer/swiftmailer) and download the newest release (5.2.1 at the time of writing this).

Unzip the archive in your project folder.  After that I have a folder named `swiftmailer-5.2.1` in my project folder that contains a `lib` folder with the libraries in it.

Now include the library at the top of your `contact.php` page.

```php
require_once(__DIR__ . '/swiftmailer-5.2.1/lib/swift_required.php');
```

Replace the line that calls the `mail` function with the following.
You can also delete the `$headers` variable as that is no longer needed.

```php
// Create the mail
$mail = Swift_Message::newInstance();
$mail->setSubject($subject);
$mail->setFrom(array($from));
$mail->setTo(array($to));
$mail->setReplyTo(array($contact['email'] => $contact['name']));
$mail->setBody($mailbody);
// Create the mail transport
if ($config['mail']['type'] == 'smtp') {
    // Use smtp account
    $transport = Swift_SmtpTransport::newInstance($config['mail']['server'], $config['mail']['port']);
    if ($config['mail']['auth']) {
        $transport->setUsername($config['mail']['username']);
        $transport->setPassword($config['mail']['password']);
    }
} else {
    // Use mail function as fallback
    $transport = Swift_MailTransport::newInstance();
}
// Create a mailer
$mailer = Swift_Mailer::newInstance($transport);
// Send the mail
$result = $mailer->send($mail);
```

Lets break this down a bit.

```php
// Create the mail
$mail = Swift_Message::newInstance();
$mail->setSubject($subject);
$mail->setFrom(array($from));
$mail->setTo(array($to));
$mail->setReplyTo(array($contact['email'] => $contact['name']));
$mail->setBody($mailbody);
```

This code creates the mail itself as an instance of `Swift_Message`.
It sets the subject, to, from, and reply-to addresses as well as the mail body.
This should be apparent fairly easily just by reading the method names.

```php
// Create the mail transport
if ($config['mail']['type'] == 'smtp') {
    // Use smtp account
    $transport = Swift_SmtpTransport::newInstance($config['mail']['server'], $config['mail']['port']);
    if ($config['mail']['auth']) {
        $transport->setUsername($config['mail']['username']);
        $transport->setPassword($config['mail']['password']);
    }
} else {
    // Use mail function as fallback
    $transport = Swift_MailTransport::newInstance();
}
```
We are checking if we have set the mail transport type to smtp in our config file.
If we have we create an instance of Swift_SmtpTransport passing in the credentials and server information we have in our config file.
Otherwise we create an instance of Swift_MailTransport which is a wrapper around the php [mail](http://us1.php.net/manual/en/function.mail.php) function we were using previously.

```php
// Create a mailer
$mailer = Swift_Mailer::newInstance($transport);
// Send the mail
$result = $mailer->send($mail);
```

The `Swift_Mailer` actually does the sending of the `Swift_Message` we created using the transport.

Our full `contact.php` page should now look like the following

```php
<?php

require_once(__DIR__ . '/recaptcha-php-1.11/recaptchalib.php');
require_once(__DIR__ . '/swiftmailer-5.2.1/lib/swift_required.php');

$valid = true;
$errors = array();
$captchaerror = null;

// Load config file
$config = include(__DIR__ . '/config.php');

$contact = array(
    'name' => null,
    'email' => null,
    'message' => null
);

// Check if the form has been posted
if (isset($_POST['recaptcha_challenge_field'],$_POST['recaptcha_response_field'])) {
    $resp = recaptcha_check_answer(
        $config['recaptcha']['privatekey'],
        $_SERVER["REMOTE_ADDR"],
        $_POST["recaptcha_challenge_field"],
        $_POST["recaptcha_response_field"]
    );

    if (!$resp->is_valid) {
        $captchaerror = $resp->error;
        $valid = false;
        $errors['captcha'] = "Entered text did not match.";
    }

    $contact = filter_input_array(INPUT_POST, array(
        'name'   => FILTER_SANITIZE_STRING,
        'email'   => FILTER_SANITIZE_STRING,
        'message'   => FILTER_SANITIZE_STRING,
    ), true);
    if (empty($contact['name'])) {
        $valid = false;
        $errors['name'] = "You must enter your name.";
    }
    if (empty($contact['email'])) {
        $valid = false;
        $errors['email'] = "You must enter your email address.";
    } elseif (!filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)) {
        $valid = false;
        $errors['email'] = "You must enter a valid email address.";
    }
    if (empty($contact['message'])) {
        $valid = false;
        $errors['message'] = "You must enter a message.";
    }
    if ($valid) {
        // The email address the email will be sent to
        $to = $config['contact']['to'];
        // Set the from address for the email
        $from = $config['contact']['from'];
        // The email subject
        $subject = "Contact Form Submission";
        // Build the body of the email
        $mailbody = "The contact form has been filled out.\n\n"
                  . "Name: " . $contact['name'] . "\n"
                  . "Email: " . $contact['email'] . "\n"
                  . "Message:\n" . $contact['message'];
        // Create the mail
        $mail = Swift_Message::newInstance();
        $mail->setSubject($subject);
        $mail->setFrom(array($from));
        $mail->setTo(array($to));
        $mail->setReplyTo(array($contact['email'] => $contact['name']));
        $mail->setBody($mailbody);
        // Create the mail transport
        if ($config['mail']['type'] == 'smtp') {
            // Use smtp account
            $transport = Swift_SmtpTransport::newInstance($config['mail']['server'], $config['mail']['port']);
            if ($config['mail']['auth']) {
                $transport->setUsername($config['mail']['username']);
                $transport->setPassword($config['mail']['password']);
            }
        } else {
            // Use mail function as fallback
            $transport = Swift_MailTransport::newInstance();
        }
        // Create a mailer
        $mailer = Swift_Mailer::newInstance($transport);
        // Send the mail
        $result = $mailer->send($mail);

        // Go to the thank you page
        header("location: thankyou.html");
        exit;
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Contact Us</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <form action="contact.php" method="post" accept-charset="utf-8" data-parsley-validate novalidate>
        <fieldset>
            <legend>Contact Us</legend>
            <?php if (!$valid): ?>
                <div class="error">
                    <?php foreach($errors as $message):?>
                        <div><?php echo htmlspecialchars($message); ?></div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <div class="row">
                <label for="name">Name: </label>
                <input id="name" type="text" name="name" value="<?php echo htmlspecialchars($contact['name']);?>" required data-parsley-required-message="You must enter your name.">
            </div>
            <div class="row">
                <label for="email">Email Address: </label>
                <input id="email" type="email" name="email" value="<?php echo htmlspecialchars($contact['email']);?>" required data-parsley-required-message="You must enter your email address." parsley-type-email-message="You must enter a valid email address.">
            </div>
            <div class="row">
                <label for="message">Message:</label>
                <textarea id="message" name="message" required data-parsley-required-message="You must enter a message."><?php echo htmlspecialchars($contact['message']);?></textarea>
            </div>
            <div class="row">
                <?php echo recaptcha_get_html($config['recaptcha']['publickey'], $captchaerror); ?>
            </div>
            <div class="row">
                <input type="submit" value="Submit">
            </div>
        </fieldset>
    </form>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/parsley.js/2.0.2/parsley.min.js"></script>
</body>
</html>

```

### Other features of Swiftmailer

Swiftmailer has a lot more functionality than we are using for our application.

It can send html and/or multipart emails.
It can send attachments and inline/embeded images.
It have more transports than just the `smtp` and `mail` as well.

I suggest taking a look at the [documentation ](http://swiftmailer.org/docs/introduction.html) for more on what it can do.

## Using a transactional email service

Now that we are using a mailing library that supports SMTP we can use a transactional email service like [Mandrill](https://mandrill.com/) or [Mailgun](http://www.mailgun.com/) to handle the email sending.

There are a number of advantages to using a transactional email service rather than just using a normal email account over SMTP or the server itself with the `mail` function.

These services are built for the enterprise and can handle large volumes of email and have very high uptime.  Your email account on your [cPanel](http://cpanel.net/) shared hosting account isn't.
Even beefier solutions like [Exchange](http://office.microsoft.com/en-us/exchange/) or [Google Apps for Business](http://www.google.com/enterprise/apps/business/index.html) are built more for people than web applications.

They tend to be very affordable.
[Mandrill](https://mandrill.com/pricing/) gives you 12,000 emails a month for free and [Mailgun](http://www.mailgun.com/) gives you 10,000.  [Amazon SES](http://aws.amazon.com/ses/pricing/) charges $0.10 per thousand emails.
This means unless you are sending tens of thousands of emails a month you wont have to pay a thing and even if you are it will only be a couple dollars a month.


Transaction services generally give you great reporting including things like bounce rates, open rates, and even logs of every email sent through the service.
This alone in enough to make it worth using even for small sites that don't send out much.

### Setting up the transactional email service

I'm going to be using [Mandrill](https://mandrill.com/) as en example but you can use any service you want.

The first step is obviously to sign up for the service.

The next step is to get the SMTP credentials for the account.
For Mandrill you can find this under `Settings`.

For Mandrill they will look something like this.

|  |  |
| ---- | -------------------- |
| Host | smtp.mandrillapp.com |
| Port | 587 |
| SMTP Username | emailaddress |
| SMTP Password | any valid API key |

You can generate an API Key at the bottom of the same page.

Next edit the mail section of the `config.php` page like the following.

```php
"mail" => array(
    "type" => "smtp",
    "server" => "smtp.mandrillapp.com",
    "port" => 587,
    "auth" => true,
    "username" => "youremailaddress",
    "password" => "yourapikey"
  )
```

That is all you have to do.  No code changes are necessary.
