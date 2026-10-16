"use client";
import { FiArrowUpRight } from "react-icons/fi";
import { Breadcrumb, Button, SectionHeading } from "../components/UI";
export default function About() {
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: "Our story" }]} />
      <section className="story-hero">
        <div>
          <span className="eyebrow">A LITTLE MORE EXCLUSIVE</span>
          <h1>
            Good things
            <br />
            for <em>real life.</em>
          </h1>
          <p>
            We think the everyday deserves a little attention. The corner where
            you work. The bag you reach for. The game you disappear into after a
            long day.
          </p>
          <p>
            Exclusive brings together a considered collection across gaming,
            technology, fashion, and home. Different finds, one simple idea:
            make room for the things that feel like you.
          </p>
          <Button href="/shop" className="about-button">
            Find your kind of everyday
            <FiArrowUpRight />
          </Button>
        </div>
        <img
          className="story-image"
          src="/images/studio.webp"
          alt="A sunlit living room with a blue sofa, plants, and a reading corner"
        />
      </section>
      <SectionHeading
        eyebrow="WHAT WE BELIEVE"
        title={
          <>
            A few things that <em>matter.</em>
          </>
        }
      />
      <div className="story-principles">
        <div>
          <span>01 / LESS, BUT CONSIDERED</span>
          <h2>Room to find your favorite.</h2>
          <p>
            A browsable selection beats an endless scroll. Explore by your
            interests, filter by your needs, and take a closer look at what
            catches your eye.
          </p>
        </div>
        <div>
          <span>02 / YOUR EVERYDAY, YOUR WAY</span>
          <h2>Good taste is personal.</h2>
          <p>
            Your wishlist is yours. Save a little inspiration, come back to it,
            and build a bag that makes sense for the way you live.
          </p>
        </div>
        <div>
          <span>03 / THE WHOLE JOURNEY</span>
          <h2>Here beyond the checkout.</h2>
          <p>
            Your account keeps your orders close, with status updates as they
            progress. Have a question? Our support inbox is ready to hear it.
          </p>
        </div>
      </div>
      <div className="notice">
        Want to know more?{" "}
        <a className="text-link" href="/contact">
          Let’s talk <FiArrowUpRight />
        </a>
      </div>
    </div>
  );
}
