import _ from 'lodash';

export default class {
    _cloud;

    /**
     * @param posts
     */
    constructor(posts) {
        this.build(posts);
    }

    build(posts) {
        let tags = {};
        posts.forEach(({node}) => {
            let t = _.get(node, "frontmatter.tags");
            if (t) {
                t.forEach(tag => {
                    if (!tags.hasOwnProperty(tag)) {
                        tags[tag] = 0
                    }
                    tags[tag]++;
                })
            }
        });

        const max = _.max(_.map(tags));
        this._cloud = _.shuffle(_.map(tags, (count, tag) => {
            let percent = count / max * 100;
            let weight = Math.floor(percent / 10);
            if (percent >= 5) {
                weight++;
            }
            if (percent >= 80 && percent < 100) {
                weight = 8;
            } else if (percent === 100) {
                weight = 9;
            }

            return {tag, slug: _.kebabCase(tag), count, weight};
        }));
    }

    get cloud() {
        return this._cloud;
    }
};
