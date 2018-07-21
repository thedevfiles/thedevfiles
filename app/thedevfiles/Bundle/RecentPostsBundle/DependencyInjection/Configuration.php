<?php

namespace TheDevFiles\Bundle\RecentPostsBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();

        $rootNode = $treeBuilder->root('thedevfiles_recent_posts');

        $rootNode
            ->children()
            ->scalarNode('num_posts')
            ->defaultValue(5)
            ->end()
            ->end();
        ;

        return $treeBuilder;
    }
}
