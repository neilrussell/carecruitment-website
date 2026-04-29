const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");

module.exports = function(eleventyConfig) {
  const md = markdownIt({ html: true }).use(markdownItAttrs);
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addFilter("date", function(value, format) {
    if (!value) return "";
    const dt = DateTime.fromJSDate(new Date(value), { zone: "utc" });
    if (format === "YYYY-MM-DD") return dt.toFormat("yyyy-MM-dd");
    if (format === "D MMMM YYYY") return dt.toFormat("d MMMM yyyy");
    return dt.toFormat(format || "yyyy-MM-dd");
  });

  // Passthrough copy — all static assets and non-blog pages
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("netlify");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("*.html");
  eleventyConfig.addPassthroughCopy("about");
  eleventyConfig.addPassthroughCopy("contact");
  eleventyConfig.addPassthroughCopy("faq");
  eleventyConfig.addPassthroughCopy("work-permit-guide");
  eleventyConfig.addPassthroughCopy("sectors");
  eleventyConfig.addPassthroughCopy("privacy");
  eleventyConfig.addPassthroughCopy("blog/index.html");

  // Sort posts by date descending
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false
  };
};
