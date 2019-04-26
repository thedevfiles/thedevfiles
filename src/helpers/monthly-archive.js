export default class {
    _archive;

    constructor(posts) {
        this.build(posts)
    }

    build(posts) {
        let archive = {};
        posts.forEach(({node}) => {

            let year = node.frontmatter.year;
            let month = node.frontmatter.month;

            if (!archive.hasOwnProperty(year)) {
                archive[year] = {
                    year: year,
                    slug: '/' + year + '/',
                    count: 0,
                    months: {}
                };
            }
            archive[year].count++;

            if (!archive[year].months.hasOwnProperty(month)) {
                archive[year].months[month] = {
                    count: 0,
                    month: month,
                    slug: '/' + year + '/' + month + '/',
                    year: year,
                    name: node.frontmatter.mname
                };
            }
            archive[year].months[month].count++;
        });

        this._archive = archive;
    }

    get archive() {
        return this._archive;
    }
}
