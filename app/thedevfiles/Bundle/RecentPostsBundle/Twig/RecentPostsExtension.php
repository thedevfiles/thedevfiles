<?php

namespace TheDevFiles\Bundle\RecentPostsBundle\Twig;

use Symfony\Component\DependencyInjection\Container;

class RecentPostsExtension extends \Twig_Extension
{
    /**
     * @var \Symfony\Component\DependencyInjection\Container
     */
    private $container;

    /**
     * @var \Twig_Environment
     */
    private $environment;

    /**
     * Constructor
     *
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Store environment to use template
     *
     * @param \Twig_Environment $environment
     */
    public function initRuntime(\Twig_Environment $environment)
    {
        $this->environment = $environment;
    }

    /**
     * Register function
     *
     * @return array
     */
    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction(
                'recent_posts',
                [
                    $this,
                    'renderRecentPosts',
                ],
                [
                    'is_safe' => ['html'],
                ]
            ),
        ];
    }

    /**
     * Render the recent posts html
     *
     * @param string $template
     *
     * @return string
     */
    public function renderRecentPosts($template = 'recent_posts.html')
    {
        $posts = $this->container->get('thedevfiles.recentposts.data_provider')->provideData();

        return $this->environment->render($template, [
            'recent_posts' => $posts,
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'thedevfiles_recent_posts';
    }
}
