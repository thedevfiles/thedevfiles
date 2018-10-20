---
layout: post
title: Secure Password Hashing with PHP
date: 2014-08-22 00:00:00 -0700
description: The password_hash function added in PHP 5.5 makes secure password hashing easy.
published: true
comments: true
sharing: true
image: /assets/images/featured/Black_Lock.png
image_width: 256
image_height: 256
categories: [User Guide]
tags: [php, security]
---

There is a lot of misinformation and uncertainty on the topic of password storage.

There are massive amounts of tutorials and articles recommending all manor of methods of storing passwords.
A large number of these are old and using methods that just are up to snuff for todays security standards.

<!--more-->

## Common password storing mistakes

Here are some of the most common mistakes make with regards to password hashing.

I've been guilty of all of these in the past.

### MD5 and SHA1 hashing

The [md5](http://us1.php.net/manual/en/function.md5.php) and [sha1](http://us1.php.net/manual/en/function.sha1.php) are not suitable for password hashing.

This is true for any of the related hashing algorithms from the [hash](http://us1.php.net/manual/en/function.hash.php) function like sha256, sha512, and so on.
While the larger hashes are slightly better than the shorter ones they all suffer from the same problem.

Over time computers are getting faster and faster and can calculate a hash in a shorter amount of time.
A high end machine with a cluster of GPUs can calculate billions of md5 hashes a second.
You can rent such a machine from [Amazon](http://aws.amazon.com/ec2/pricing/) for less than $1 an hour.

Over time each of these hashing functions will become faster and faster to break.

The other weakness of these algorithms is that unless the passwords are also salted they are susceptible to rainbow table attacks.

Every time a password is hashed it will result in the same hash.
This means if you have a list of hashes and their corresponding passwords you can just find the hash in the list to break the password.

### Trying to create your own hashing algorithm

People have tried to get around the fast hashing algorithms by running them multiple times or trying to mix and match them to create their own hashing algorithm.

The problem is that the hashes can be calculated so fast that it would take thousands of hashes to make a difference.
Even then at time moves on computers will get even faster and the number of necessary hashes will just keep increasing.

### Using the same salt for all passwords

Using the same salt for all passwords is much better then not using a salt at all.

Every password should have its own salt.

## The Solution

So how should passwords be hashed?

1. Each password needs to be salted with a different cryptographic salt.
2. The hashing algorithm must not be fast regardless of the power of the machine used to generate them.

The current recommended methods for securely hashing passwords are [Bcrypt](http://en.wikipedia.org/wiki/Bcrypt) or [PBKDF2](http://en.wikipedia.org/wiki/PBKDF2).

The Bcrypt algorithm can be used with the [crypt](http://us1.php.net/manual/en/function.crypt.php) function but this isn't very easy to use.
You still need to generate a cryptographic salt and that isn't very easy either.

Thankfully there is now a better way.

PHP 5.5 added the [password_hash](http://php.net/manual/en/function.password-hash.php) function which hides the ugliness of using the crypt function and makes secure password hashing truly easy.

Not using PHP 5.5+?  The [ircmaxell/password_compat](https://github.com/ircmaxell/password_compat) library will add the same functionality to PHP 5.3.7+.

Even better? The password_hash function is future proof.  While Bcrypt is the best algorithm available to PHP for hashing passwords this may not always be the case.
As better algorithms are released the password_hash function will automatically use the best algorithm available.

Your application will begin to use the newer more secure algorithm without you even touching the code.

## Using password_hash for password hashing

For this example I'm assuming you have a database table called users with a username and a password column.

I'm also using PDO for the database interactions.
If you need help using PDO take a look at the article I wrote about [Migrating from mysql_query to PDO](/2014/08/moving-from-mysql-query-to-pdo/).
Make sure to use prepared statements to prevent SQL injection.

```php
<?php

class UserModel
{

    /**
     * @var PDO
     */
    protected $dbh;

    /**
     * @param PDO $dbh
     */
    public function __construct(PDO $dbh)
    {
        $this->dbh = $dbh;
    }

    /**
     * Checks account credentials
     *
     * @param string $username
     * @param string $password
     *
     * @return array|false Array of user data if credentials are correct or boolean false if credentials are not correct
     */
    public function checkCredentials($username, $password)
    {
        $user = $this->getUserByUsername($username);
        if (!$user) {
            // No user found with provided username
            return false;
        }
        if (!password_verify($password, $user['password'])) {
            // Password does not match
            return false;
        }
        if (password_needs_rehash($user['password'], PASSWORD_DEFAULT)) {
            // This password was hashed using an older algorithm, update with new hash.
            $this->updatePassword($user['id'], $password);
        }
        // The password is no longer needed from the user data
        unset($user['password']);
        return $user;
    }

    /**
     * Returns a user by username
     *
     * @param string $username
     *
     * @return array|false Array of user data if found or boolean false if not found
     */
    public function getUserByUsername($username)
    {
        $sth = $this->dbh->prepare("SELECT * FROM users WHERE username LIKE :username");
        $sth->bindValue(":username", $username);
        $sth->execute();
        return $sth->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Updates a user's password
     *
     * @param int $id
     * @param string $password
     *
     * @return int Number of affected rows
     */
    public function updatePassword($id, $password)
    {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $sth = $this->dbh->prepare("UPDATE users SET password = :password WHERE id = :id");
        $sth->bindValue(":password", $hash);
        $sth->bindValue(":id", $id, PDO::PARAM_INT);
        return $sth->execute();
    }
}

```

### How it works

1. You pass the username and password the user provided in the login form to the checkCredentials method.
2. This method searches the database for a user with a matching username.
3. If no user is found the provided username was incorrect.
4. Next the [password_verify](http://php.net/manual/en/function.password-verify.php) is called to check if the password was used to generate the hash that was stored in the database for the user with the matching username.
5. If it returns false then the provided password was incorrect.
6. Now that we have confirmed the provided login credentials are correct we pass the hashed password from the database to [password_needs_rehash](http://php.net/manual/en/function.password-needs-rehash.php).  This checks if the password needs to be upgraded to a newer, stronger algorithm.
7. If it returns true update the user's password by passing the provided password to the [password_hash](http://php.net/manual/en/function.password-hash.php) function.
8. Return the user account so you can log the user in.
