import credits from "../lib/image-credits.json";
import { Breadcrumb } from "../components/UI";
export default function Credits() {
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: "Image credits" }]} />
      <div className="page-heading">
        <div>
          <span className="eyebrow">GOOD WORK DESERVES CREDIT</span>
          <h1>
            Seen through
            <br />
            <em>another lens.</em>
          </h1>
          <p>
            Replacement images from Wikimedia Commons, under the licenses below.
            <br />
            Photos have been resized and converted to WebP. Product photos are
            representative.
          </p>
        </div>
      </div>
      <div className="credits-grid">
        {Object.entries(credits).map(([key, c]) => (
          <article className="credit-card" key={key}>
            <img src={c.path} alt={key} loading="lazy" />
            <div>
              <h2>{c.title.replace("File:", "")}</h2>
              <p>
                By {c.artist.replaceAll("&amp;", "&")}
                <br />
                {c.license}
                <br />
                Resized and converted to WebP. CC BY-SA derivatives retain the
                same license.
              </p>
              <a href={c.source} target="_blank" rel="noreferrer">
                Original source ↗
              </a>
              <a
                href={c.licenseUrl || c.source}
                target="_blank"
                rel="noreferrer"
              >
                License ↗
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="auth-footnote">
        DM Sans and Instrument Serif are self-hosted Google Fonts, licensed
        under the SIL Open Font License. License files are included with the
        font assets.
      </p>
    </div>
  );
}
