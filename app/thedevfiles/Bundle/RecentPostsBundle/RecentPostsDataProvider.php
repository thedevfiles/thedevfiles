<?php

namespace TheDevFiles\Bundle\RecentPostsBundle;

use Sculpin\Core\DataProvider\DataProviderInterface;
use Symfony\Component\DependencyInjection\Container;

class RecentPostsDataProvider implements DataProviderInterface
{
    /**
     * @var \Sculpin\Core\DataProvider\DataProviderInterface
     */
    private $dataProvider;

    /**
     * @var mixed
     */
    private $computedData = false;
    /**
     * @var Container
     */
    private $container;

    /**
     * Constructor
     *
     * @param \Sculpin\Core\DataProvider\DataProviderInterface $dataProviderManager
     * @param Container                                        $container
     */
    public function __construct(DataProviderInterface $dataProviderManager, Container $container)
    {
        $this->dataProvider = $dataProviderManager;
        $this->container    = $container;
    }

    /**
     * Provide data about post organized per year and couple year/month
     *
     * Return array(
     *   'year' = > array of posts,
     *   'year-month' => array of posts
     * )
     *
     * @return array
     */
    public function provideData()
    {
        if ($this->computedData !== false) {
            return $this->computedData;
        }

        $posts = $this->dataProvider->provideData();
        $limit = $this->container->getParameter('thedevfiles.recent_posts.num_posts');

        foreach ($posts as $post) {
            $data[] = $post;
        }

        $this->computedData = array_splice($data, 0, $limit);

        return $this->computedData;
    }
}
