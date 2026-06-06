const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {

  // Exclude _md-pages from template processing — the eleventy.after hook copies them manually
  eleventyConfig.ignores.add("_md-pages/**");

  // After each build: (1) copy _md-pages/* into _site mirroring the output structure,
  // (2) copy raw blog post .md source files to their _site/blog/[slug]/ directories.
  // This creates .md endpoints for every major page without affecting any HTML output.
  eleventyConfig.on("eleventy.after", async ({ dir, results }) => {
    function walkAndCopy(srcDir, destDir) {
      fs.mkdirSync(destDir, { recursive: true });
      for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        if (entry.isDirectory()) {
          walkAndCopy(srcPath, destPath);
        } else if (entry.name.endsWith(".md")) {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    const mdPagesDir = path.join(dir.input, "_md-pages");
    if (fs.existsSync(mdPagesDir)) {
      walkAndCopy(mdPagesDir, dir.output);
    }

    for (const result of results || []) {
      if (result.inputPath && result.inputPath.includes("/posts/") && result.inputPath.endsWith(".md")) {
        try {
          const content = fs.readFileSync(result.inputPath, "utf8");
          const slugMatch = content.match(/^slug:\s*['"]?([^'"\n]+)/m);
          if (slugMatch) {
            const slug = slugMatch[1].trim();
            const destDir = path.join(dir.output, "blog", slug);
            if (fs.existsSync(destDir)) {
              fs.writeFileSync(path.join(destDir, "index.md"), content);
            }
          }
        } catch (e) { /* skip unreadable */ }
      }
    }
  });
  const md = markdownIt({ html: true }).use(markdownItAttrs);
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addFilter("date", function(value, format) {
    if (!value) return "";
    const dt = DateTime.fromJSDate(new Date(value), { zone: "utc" });
    if (format === "YYYY-MM-DD") return dt.toFormat("yyyy-MM-dd");
    if (format === "D MMMM YYYY") return dt.toFormat("d MMMM yyyy");
    return dt.toFormat(format || "yyyy-MM-dd");
  });

  eleventyConfig.addFilter("json", function(value) {
    return JSON.stringify(value);
  });

  // Passthrough copy — all static assets and non-blog pages
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("netlify");
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("llms.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("sitemap_index.xml");
  eleventyConfig.addPassthroughCopy("*.html");
  eleventyConfig.addPassthroughCopy("about");
  eleventyConfig.addPassthroughCopy("contact");
  eleventyConfig.addPassthroughCopy("faq");
  eleventyConfig.addPassthroughCopy("work-permit-guide");
  eleventyConfig.addPassthroughCopy("sectors");
  eleventyConfig.addPassthroughCopy("privacy");
  eleventyConfig.addPassthroughCopy("terms");
  eleventyConfig.addPassthroughCopy("guarantee-terms");
  eleventyConfig.addPassthroughCopy("filipino-recruitment-agency-ireland");
  eleventyConfig.addPassthroughCopy("hire-filipino-workers-ireland");
  eleventyConfig.addPassthroughCopy("hire-overseas-care-workers-ireland");
  eleventyConfig.addPassthroughCopy("hire-overseas-chefs-ireland");
  eleventyConfig.addPassthroughCopy("blog/index.html");
  eleventyConfig.addPassthroughCopy("blog/how-to-hire-farm-workers-from-overseas-ireland");
  eleventyConfig.addPassthroughCopy("blog/home-care-providers-hiring-overseas-care-workers-ireland");
  eleventyConfig.addPassthroughCopy("blog/how-to-hire-construction-workers-from-overseas-ireland");
  eleventyConfig.addPassthroughCopy("hire-overseas-construction-workers-ireland");
  eleventyConfig.addPassthroughCopy("hire-overseas-farm-workers-ireland");
  eleventyConfig.addPassthroughCopy("overseas-recruitment-agency-ireland");

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
