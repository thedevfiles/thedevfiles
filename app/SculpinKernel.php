<?php

class SculpinKernel extends \Sculpin\Bundle\SculpinBundle\HttpKernel\AbstractKernel
{
    protected function getAdditionalSculpinBundles()
    {
        return array(
          'Jb\Bundle\DateNavigationBundle\JbDateNavigationBundle',
          'Jb\Bundle\TagCloudBundle\JbTagCloudBundle',
          'Mavimo\Sculpin\Bundle\EditorBundle\SculpinEditorBundle',
          'Mavimo\Sculpin\Bundle\RedirectBundle\SculpinRedirectBundle',
          'TheDevFiles\Bundle\RecentPostsBundle\RecentPostsBundle'
        );
    }
}
