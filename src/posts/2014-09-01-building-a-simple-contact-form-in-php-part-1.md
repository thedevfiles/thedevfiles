---
slug: building-a-simple-contact-form-in-php-part-1
path: "/2014/09/building-a-simple-contact-form-in-php-part-1"
title: Building a simple contact form in PHP - Part 1
date: 2014-09-01 00:00:00
description: Building a simple contact form in PHP
published: true
comments: true
sharing: true
image: "../assets/images/featured/contact-form.png"
image_width: 470
image_height: 420
last: /2014/09/building-a-simple-contact-form-in-php-part-5/
next: /2014/09/building-a-simple-contact-form-in-php-part-2/
categories: [Tutorial]
tags: [php, mail]
---

In this series we will be building a simple contact form in php.

It will cover sending emails and form validation.

<!--more-->

## Creating the Contact Form

We will start with the form itself.

Save the following as contact.php
```html
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

We will also add a stylesheet with some basic styles for the form.

Save the following as styles.css
```css
fieldset {
    margin:0 auto;
    width: 235px;
}
legend {
    font-weight:bold;
    font-size:125%;
}
form div.row {
    margin-bottom: 8px;
}
label {
    display: block;
    font-weight:bold;
}
input[type=text],input[type=email] {
    display:block;
    width: 400px;
}

textarea {
    width: 400px;
    height:200px;
}
```

If you view the page in a browser it should look something like this.

![Contact Form](../assets/images/contact-form/part-1/contact-form.png)

Not the prettiest form but this isn't a design tutorial.
Feel free to add your own styles.

We also will need a page to send the user to after they submit the form.
This should have some sort of "Thank you for submitting" message on it.

Save the following as thankyou.html
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Contact Us</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <p>Thank you for your message.</p>
</body>
</html>
```

## Sending an email on form post.

We have a form but it doesn't do anything when the user submits it.

Add the following to the top of the contact.php page above the `<!DOCTYPE html>` line.

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
```

The entire page should not look like this.

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

### How does it work?

First we are checking if each of the form fields have been posted.
If they exist the user has submitted the form.

```php
if (isset($_POST['name'], $_POST['email'], $_POST['message'])) {
```

Next we define where we would like the email to be sent and what the subject of the email should be.
Change the `$to` variable to your own email address.

```php
// The email address the email will be sent to
$to = "business@example.com";
// The email subject
$subject = "Contact Form Submission";
```

The headers set the email address used for the from in the email.
The other line indicates the application used to send the email.  In this case php.

```php
// Set the from and reply-to address for the email
$headers = "From: website@example.com\r\n"
         . "X-Mailer: PHP/" . phpversion();
```

We now need to build the body of the email itself.
It should include each of the posted values.

```php
// Build the body of the email
$mailbody = "The contact form has been filled out.\n\n"
          . "Name: " . $_POST['name'] . "\n"
          . "Email: " . $_POST['email'] . "\n"
          . "Message:\n" . $_POST['message'];
```

Next we use the [php mail](http://us3.php.net/manual/en/book.mail.php) function to actually send the email.

```php
// Send the email
mail($to, $subject, $mailbody, $headers);
```

Finally we send the user to the thankyou.html page that we created.

```php
// Go to the thank you page
header("location: thankyou.html");
exit;
```

## Improving the script

While this script would work as is for your contact form it have a number of problems with it.

The biggest one is that there is no form validation.
A user can submit a blank form and it will send the email and redirect to the thankyou.html page anyway.

The data the user is submitting is not being escaped or filtered.
We only want plain text being submitted through the form but without any enforcement of that the user can submit anything including scripts that might cause security issues with certain email clients.

There is nothing to help prevent spam.
Once a spam-bot finds this script you could find your inbox full of worthless junk.

In the next part I will tackle some of these issues.
