---
layout: post
title: Building a simple contact form in PHP - Part 3
date: 2014-09-03 00:00:00 -0700
description: Adding client-side form validation to a php contact form.
published: false
categories: [php, mail]
---

As we last left it in [part 2](/2014/08/building-a-simple-contact-form-in-php-part-2) of [Building a simple contact form in PHP](/2014/08/building-a-simple-contact-form-in-php-part-1) we added server-side form validation to our contact form and input filtering to the submitted data before sending out the email.

In this part we are going to add some client-side validation to our contact form.

<!--more-->

This is the contact form as we left it.

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

## Why Add Client-Side Validation?

It is important to keep in mind that client-side validation doesn't not provide any extra security for your application.  Circumventing it is as easy as turning off javascript in your browser.
Implementing client-side validation without server-side validation is like not having any validation at all.
So why even have client-side validation?  Server-Side validation will catch all of the same problems so what is the benefit?

The reason to use client-side validation is simply to make things a bit easier on the user.
To validate something om the server the form must be submitted and a new request is created.
If the validation fails the browser must download and render the page again including all assets like css, and images.  Any javascript files will be run again.
If a required form field is blank why even bother to send the request to the server in the first place just to tell you what you already know?

For a form as small as this contact form this isn't really a big deal but the more fields there are and the more complicated the form is the more valuable client-side form validation becomes.

## Adding HTML5 Client-Side Validation

Most browsers actually have built in client-side validation just by adding attributes to your form elements.

Add a `required` attribute to each of the form elements.

```php
// name
<input id="name" type="text" name="name" value="<?php echo htmlspecialchars($contact['name']);?>" required>
// email
<input id="email" type="text" name="email" value="<?php echo htmlspecialchars($contact['email']);?>" required>
// message
<textarea id="message" name="message"><?php echo htmlspecialchars($contact['message']);?></textarea>
```
Now load up the form any try submitting a blank form.
Depending on your browser you should see a message telling you to fill out a required field and the form isn't submitted.

Here is what it looks like in Google Chrome.

![HTML5 Validation](/images/contact-form/part-3/html5-validation.png)

Now change the email input type from `text` to `email` so it looks like the following.

```php
<input id="email" type="email" name="email" value="<?php echo htmlspecialchars($contact['email']);?>" required>
```
Now fill out the other two fields en enter something that isn't an email address in the email field.

Here is what I see in Google Chrome.

![HTML5 Validation](/images/contact-form/part-3/html5-email-validation.png)

This also has the benefit of showing an email-specific keyboard on many mobile devices when the email field is filled out.

## Javascript Form Validation using Parsley

While the built-in html5 validation does get the job done it tends to be ugly and you don't have much control over it.

We are going to use a form validation library called [Parsley](http://parsleyjs.org) to help us add form validation that will use the same attributes as the html5 form validation we already added.

Add the following to the html below the form but before the closing `</body>` tag.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/parsley.js/2.0.2/parsley.min.js"></script>
```

Parsley depends on [jQuery](http://jquery.com) so I am loading that as well as the Parsley library itself.
I am loading both using a [CDN](http://en.wikipedia.org/wiki/Content_delivery_network) but you could just as easily download both libraries from their websites and include them locally.

Now that the library is included the first thing we need to do is disable the html5 form validation.  
Add a `novalidate` attribute to the `form` tag.  This will disable the built-in html5 form validation so we can have Parsley do the work.

Next we need to tell Parsley that we want it to validate our form.  
Add a `data-parsley-validate` attribute to the `form` tag.

The form tag should now look like the following.

```php
<form action="contact.php" method="post" accept-charset="utf-8" data-parsley-validate novalidate>
```

Now load up the page and try submitting a blank form.

You should see `This value is required.` under each of the form fields.

Lets make it look a bit better.  Add the following to your `styles.css` file.

```css
ul.parsley-errors-list{
    margin:0;
    padding:0;
}
ul.parsley-errors-list li{
    margin:0 0 0 5px;
    padding:0;
    list-style-type: none;
    color: #CC0000;
    font-weight:bold;
}
```

![HTML5 Validation](/images/contact-form/part-3/parsely-validation.png)

### Customizing error messages

Now we are going to customize the error messages displayed for failed form validation.

Add a `data-parsley-required-message` attribute to each of the form fields equal to the message you want displayed when that validation fails.
It should look like the following.

```php
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
```
Now the custom messages you provided will be displayed instead of the default `This value is required.` message.

![HTML5 Validation](/images/contact-form/part-3/parsely-messages.png)

 The full `contact.php` should now look like the following.

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