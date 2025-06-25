---
slug: building-a-simple-contact-form-in-php-part-2
title: Building a simple contact form in PHP - Part 2
date: "2014-09-02 00:00:00"
description: Adding server-side form validation to a php contact form.
published: true
comments: true
sharing: true
image: "../assets/images/featured/contact-form-validation.png"
first: /2014/09/building-a-simple-contact-form-in-php-part-1/
last: /2014/09/building-a-simple-contact-form-in-php-part-5/
prev: /2014/09/building-a-simple-contact-form-in-php-part-1/
next: /2014/09/building-a-simple-contact-form-in-php-part-3/
categories: [php, mail]
---

In [part 1](/2014/09/building-a-simple-contact-form-in-php-part-1/) of [Building a simple contact form in PHP](/2014/09/building-a-simple-contact-form-in-php-part-1/) we built a simple contact form that sends a notification when the form is posted with the values the user posted.

As we discussed at the end of [part 1](/2014/09/building-a-simple-contact-form-in-php-part-1/) there are a few problems with our contact form.

We are going to work on solving some of those problems.

<!--more-->

The is what the contact form looked like as we last left it.

```php
<?php

// Check if the form has been posted
if (isset($_POST['name'], $_POST['email'], $_POST['message'])) {
    // The email address the email will be sent to
    $to = "business@example.com";
    // The email subject
    $subject = "Contact Form Submission";
    // Set the from and reply-to address for the email
    $headers = "From: website@example.com\r\n"
             . "X-Mailer: PHP/" . phpversion();
    // Build the body of the email
    $mailbody = "The contact form has been filled out.\n\n"
              . "Name: " . $_POST['name'] . "\n"
              . "Email: " . $_POST['email'] . "\n"
              . "Message:\n" . $_POST['message'];
    // Send the email
    mail($to, $subject, $mailbody, $headers);
    // Go to the thank you page
    header("location: thankyou.html");
    exit;

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
<form action="contact.php" method="post" accept-charset="utf-8">
     <fieldset>
         <legend>Contact Us</legend>
         <div class="row">
             <label for="name">Name: </label>
             <input id="name" type="text" name="name" value="">
         </div>
         <div class="row">
             <label for="email">Email Address: </label>
             <input id="email" type="text" name="email" value="">
         </div>
         <div class="row">
             <label for="message">Message:</label>
             <textarea id="message" name="message"></textarea>
         </div>
         <div class="row">
             <input type="submit" value="Submit">
         </div>
     </fieldset>
 </form>
</body>
</html>
```

## Adding Form Validation

Right now a user is able to submit a blank form and an email will still be sent.

We are going to add some server side validation so the form submission will only be accepted if the form is fully filled out.

We will also require the data entered in the email field to be a valid email address.

We will start by added a variable that we will use to store any validation error messages that we need to show to the user as well as a flag used to mark the form as failed validation.

Add the following to the top of the php code.

```php
$valid = true;
$errors = array();
```

Next after the form is posted we will check that each field not empty.

Add the following code directly after the `if` and before email body is built.

```php
if (empty($_POST['name'])) {
    $valid = false;
    $errors['name'] = "You must enter your name.";
}
if (empty($_POST['email'])) {
    $valid = false;
    $errors['email'] = "You must enter your email address.";
}
if (empty($_POST['message'])) {
    $valid = false;
    $errors['message'] = "You must enter a message.";
}
```

Now we need to only send the email if `$valid` is still true.  Wrap the email sending with a check to see if `$valid` is truthy.

The php code should now look like the following.

```php
<?php

$valid = true;
$errors = array();

// Check if the form has been posted
if (isset($_POST['name'], $_POST['email'], $_POST['message'])) {
    if (empty($_POST['name'])) {
        $valid = false;
        $errors['name'] = "You must enter your name.";
    }
    if (empty($_POST['email'])) {
        $valid = false;
        $errors['email'] = "You must enter your email address.";
    }
    if (empty($_POST['message'])) {
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
                 . "X-Mailer: PHP/" . phpversion();
        // Build the body of the email
        $mailbody = "The contact form has been filled out.\n\n"
                  . "Name: " . $_POST['name'] . "\n"
                  . "Email: " . $_POST['email'] . "\n"
                  . "Message:\n" . $_POST['message'];
        // Send the email
        mail($to, $subject, $mailbody, $headers);
        // Go to the thank you page
        header("location: thankyou.html");
        exit;
    }
}

?>
```

Note that I am using the [empty](http://us2.php.net/manual/en/function.empty.php) function to check if the form field is not empty.
The empty function only checks if a value is falsey.  Since php is a loosely-typed language an empty string or even the string "0" will evaluate to false.
This means if the user enters the number `0` in a field the form validation will determine that the field is empty.
For this form that is fine as `0` is not valid entry for any of the fields we have but if we have a form field where 0 is a valid answer we could not use the `empty` function to validate that field.

Now we need to show these validation error messages to the user when they submit the form.

Add the following to the form right after the `<legend>` field.

```php
<?php if (!$valid): ?>
    <div class="error">
        <?php foreach($errors as $message):?>
            <div><?php echo htmlspecialchars($message); ?></div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>
```

Now, when the user submits the form without filling out one or more of the fields no email will be sent and the messages will be shown to the user.

### Email Address Validation

Since the main purpose of a contact form is to allow communication with users we need to make sure that the value entered in the email field is an email address rather then just checking if the field is not empty.

We will use the [filter_input](http://us2.php.net/manual/en/function.filter-input.php) to validate the email address.

Change the validation for the email field to the following

```php
if (empty($_POST['email'])) {
    $valid = false;
    $errors['email'] = "You must enter your email address.";
} elseif (!filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)) {
    $valid = false;
    $errors['email'] = "You must enter a valid email address.";
}
```

Our full contact.php page should now look like this.

```php
<?php

$valid = true;
$errors = array();

// Check if the form has been posted
if (isset($_POST['name'], $_POST['email'], $_POST['message'])) {
    if (empty($_POST['name'])) {
        $valid = false;
        $errors['name'] = "You must enter your name.";
    }
    if (empty($_POST['email'])) {
        $valid = false;
        $errors['email'] = "You must enter your email address.";
    } elseif (!filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL)) {
        $valid = false;
        $errors['email'] = "You must enter a valid email address.";
    }
    if (empty($_POST['message'])) {
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
                 . "X-Mailer: PHP/" . phpversion();
        // Build the body of the email
        $mailbody = "The contact form has been filled out.\n\n"
                  . "Name: " . $_POST['name'] . "\n"
                  . "Email: " . $_POST['email'] . "\n"
                  . "Message:\n" . $_POST['message'];
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
    <form action="contact.php" method="post" accept-charset="utf-8">
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
                <input id="name" type="text" name="name" value="">
            </div>
            <div class="row">
                <label for="email">Email Address: </label>
                <input id="email" type="text" name="email" value="">
            </div>
            <div class="row">
                <label for="message">Message:</label>
                <textarea id="message" name="message"></textarea>
            </div>
            <div class="row">
                <input type="submit" value="Submit">
            </div>
        </fieldset>
    </form>
</body>
</html>
```

### Repopulating the Form

We are giving users messages telling them they need to fill out all of the fields but we still need to repopulate the form with the values they submitted.

There is little more annoying to users than filling out a form only to be told they did it wrong and being forced to do it all over again.

What if they spent time typing out a long message but forgot to fill out the name field?
They will once again be staring at a blank form.
They will more likely just leave rather than retype their message.

To repopulate the form we will need some variables to store the posted data in.

Add the following above the mail sending code.

```php
$contact = array(
    'name' => null,
    'email' => null,
    'message' => null
);
```

This will initialize the variable so we don't have to check if the form was posted in the middle of our html.

Change the form fields to the following.

```php
<div class="row">
    <label for="name">Name: </label>
    <input id="name" type="text" name="name" value="<?php echo htmlspecialchars($contact['name']);?>">
</div>
<div class="row">
    <label for="email">Email Address: </label>
    <input id="email" type="text" name="email" value="<?php echo htmlspecialchars($contact['email']);?>">
</div>
<div class="row">
    <label for="message">Message:</label>
    <textarea id="message" name="message"><?php echo htmlspecialchars($contact['message']);?></textarea>
</div>
```

We are using [htmlspecialchars](http://us2.php.net/manual/en/function.htmlspecialchars.php) to escape the data to prevent [cross-site scripting](http://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

While we are on the subject of security we are also going to add some filtering to the input before sending the emails.
While we are sending plain text emails we don't want to trust that whatever email client is used to read the email wont try to do something like try to run something posted to the form.

Add the following code right before the form validation.

```php
$contact = filter_input_array(INPUT_POST, array(
    'name'   => FILTER_SANITIZE_STRING,
    'email'   => FILTER_SANITIZE_STRING,
    'message'   => FILTER_SANITIZE_STRING,
), true);
```

Now anywhere in the validation or email sending code that references `$_POST` should be changed to `$contact`

![Form Validation](../assets/images/contact-form/part-2/validation.png)

### Using the posted email address as the Reply-To address

Now that we have validated that the email address field contains an email address we can use the email address the user submitted as the Reply-To address for the email.
This will allow you to hit reply in your email client to send a reply directly to the user.

Change the `$headers` line to the following.

```php
$headers = "From: website@example.com\r\n"
 . "Reply-To: " . $contact['email'] . "\r\n"
 . "X-Mailer: PHP/" . phpversion();
```

 The full `contact.php` should now look like the following.

```php
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
    <form action="contact.php" method="post" accept-charset="utf-8">
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
                <input id="name" type="text" name="name" value="<?php echo htmlspecialchars($contact['name']);?>">
            </div>
            <div class="row">
                <label for="email">Email Address: </label>
                <input id="email" type="text" name="email" value="<?php echo htmlspecialchars($contact['email']);?>">
            </div>
            <div class="row">
                <label for="message">Message:</label>
                <textarea id="message" name="message"><?php echo htmlspecialchars($contact['message']);?></textarea>
            </div>
            <div class="row">
                <input type="submit" value="Submit">
            </div>
        </fieldset>
    </form>
</body>
</html>
```

## Summary

We have added server-side form validation, input sanitation, repopulated the form on failed validation, and set the Reply-To header.

Next time we are going to add some client-side form validation to make the user experience a bit more pleasant.

We will also going to add some anti-spam protection to the form.
