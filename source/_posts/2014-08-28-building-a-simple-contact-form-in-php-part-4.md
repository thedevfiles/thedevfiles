---
layout: post
title: Building a simple contact form in PHP - Part 4
date: 2014-08-28 00:00:00 -0700
published: false
description: Adding a reCAPTCHA field to a php contact form
categories: [php, mail]
---

In of [part 3](/2014/08/building-a-simple-contact-form-in-php-part-3) of [Building a simple contact form in PHP](/2014/08/building-a-simple-contact-form-in-php-part-1) we added client-side validation to our form.

In this part we are going to add a [CAPTCHA](http://en.wikipedia.org/wiki/Captcha) field to the form in order to reduce spam.

<!--more-->

We have validation to help prevent blank form submissions but there is still nothing to stop spam bots from sending a bunch of junk posts via some automated script.

A common way of reducing spam is by adding a [CAPTCHA](http://en.wikipedia.org/wiki/Captcha) field to the form.
These are those fields with the distorted random characters that you need to copy in order to submit the form.
They can be annoying but they are pretty effective at stopping automated spam submissions.

We are going to use the [reCAPTCHA](https://www.google.com/recaptcha/intro/index.html) service and library to implement this CAPTCHA field.

As we left it our contact form looked like the following.

```php contact.php
<?php

$valid = true;
$errors = array();

$contact = array(
    'name' => null,
    'email' => null,
    'message' => null
);

// Check if the form has been posted
if (isset($_POST['name'], $_POST['email'], $_POST['message'])) {
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
        mail($to, $subject, $mailbody);
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
                <input type="submit" value="Submit">
            </div>
        </fieldset>
    </form>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/parsley.js/2.0.2/parsley.min.js"></script>
</body>
</html>
```

## Adding reCAPTCHA to the form

The first step is to go to the reCAPTCHA website and sign up for the service.
You will need a Google account to sign up.

Once you sign up you should receive a public and a private API key.
Save these as you will need them later.

Once you have an account and your api keys download the php sdk library from [the project site](https://code.google.com/p/recaptcha/downloads/list?q=label:phplib-Latest) and unzip it in your project folder.

### Storing the api keys

We can of course just put the api keys right in the script that needs them but there are advantages to creating a separate configuration file to store things like settings and credentials for our application.

The problem with putting the configuration directly in the contact.pp script is that while we only have one form that needs a reCAPTCHA now what happens if need to add more later?
We just put the api keys in that file as well.
Then what happens when those keys need to change?
We would have to open every page that uses them to change it.

It is a lot easier to have them stored in once place no matter how many times we need them.

This becomes even more important with things like database credentials that are used much more often.

One of the key principals of software development is [Don't repeat yourself](http://en.wikipedia.org/wiki/Don't_repeat_yourself).

We are also going to use this configuration file to store the `To` and `From` address we are using for our email.

Create a file named `config.php` in the same directory as the `contact.php` page with the following content.

```php config.php
<?php
return array(
  "recaptcha" => array(
    "publickey" => "paste-your-pulic-key-here",
    "privatekey" => "paste-your-private-key-here"
  ),
  "contact" => array(
    "to" => "business@example.com",
    "from" => "website@example.com"
  ),
);
```

Replace the values with your own reCAPTCHA keys and the `to` and `from` email addresses with the ones you have been using previously.

Now add the following to your contact.php page.

```php
// Load config file
$config = include(__DIR__ . '/config.php');
```

This will load the configuration values into a `$config` array.

Change the initialization of the variables we are using to send the email to the following

```php
// The email address the email will be sent to
$to = $config['contact']['to'];
// Set the from address for the email
$from = $config['contact']['from'];
// The email subject
$subject = "Contact Form Submission";
// Set the from and reply-to address for the email
$headers = "From: " . $from . "\r\n"
         . "Reply-To: " . $contact['email'] . "\r\n"
         . "X-Mailer: PHP/" . phpversion();
```


### Adding the reCAPTCHA field

First we need to include the [reCAPTCHA sdk library](https://code.google.com/p/recaptcha/downloads/detail?name=recaptcha-php-1.11.zip) that we previously downloaded.

Mine is unzipped into a folder named `recaptcha-php-1.11` in the project folder.  That folder should have a `recaptchalib.php` file in it.

Add the following to the top of the `contact.php` page to include the library.

```php
require_once(__DIR__ . '/recaptcha-php-1.11/recaptchalib.php');
```

Load up the page to make sure there are no errors.  If there are the path to the library file is incorrect.

The reCAPTCHA library needs a variable to store its errors in.
Add the following where we initialize our `$errors` and `$valid` variable.

```php
$captchaerror = null;
```

Now we add the form field for the reCAPTCHA field.

```php
<div class="row">
    <?php echo recaptcha_get_html($config['recaptcha']['publickey'], $captchaerror); ?>
</div>
```

The reCAPTCHA field should show up on the form but wont do anything until we add code to check the posted value.

![reCAPTCHA](/images/contact-form/part-4/reCAPTCHA.png)

Add another check to make sure a value was posted by changing the line that checks the other posted variables to the following.

```php
if (isset($_POST['name'], $_POST['email'], $_POST['message'], $_POST['recaptcha_challenge_field'], $_POST['recaptcha_response_field'])) {
```

Actually with the validation code we have we don't need to check the other form fields anymore so it can be changed to the following.

```php
if (isset($_POST['recaptcha_challenge_field'], $_POST['recaptcha_response_field'])) {
```

Now add the following just after that line and before the form validation code.

```php
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
```
This code checks the value the user submitted for the reCAPTCHA field to make sure it matches the image that was displayed to them.
If it doesn't it marks the form for failed validation.

Our full `contact.php` script should now look like the following.

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
        $to = $config['contact']['to'];
        // Set the from address for the email
        $from = $config['contact']['from'];
        // The email subject
        $subject = "Contact Form Submission";
        // Set the from and reply-to address for the email
        $headers = "From: " . $from . "\r\n"
                 . "Reply-To: " . $contact['email'] . "\r\n"
                 . "X-Mailer: PHP/" . phpversion();
        // Build the body of the email
        $mailbody = "The contact form has been filled out.\n\n"
                  . "Name: " . $contact['name'] . "\n"
                  . "Email: " . $contact['email'] . "\n"
                  . "Message:\n" . $contact['message'];
        // Send the email
        mail($to, $subject, $mailbody);
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