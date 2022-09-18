import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { email } from '@config';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import DisplacementSphere from '@utils/animation/DisplacementSphere';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-width: 480px) and (min-height: 700px) {
    padding-bottom: 10vh;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-lg);
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h2 {
    color: var(--white);
  }

  h3 {
    margin-top: 10px;
    color: var(--white);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 600px;
    color: var(--white);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 20px;
    margin-right: 30px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = (
    <h1>
      Hi there!{' '}
      <span role="img" aria-label="waving-hand">
        👋🏼
      </span>
    </h1>
  );
  const two = <h2 className="big-heading">I'm Li Yong.</h2>;
  const three = <h3 className="big-heading">Software Engineer.</h3>;
  const four = (
    <p>
      I'm a professional software engineer. I'm now working as a full stack blockchain engineer and
      also a machine learning engineer
    </p>
  );
  const five = (
    <div>
      <a href={`mailto:${email}`} className="email-link">
        Get In Touch
      </a>
      <a
        className="email-link"
        href="/Sanket_Sapkal_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer">
        Resume
      </a>
    </div>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <>
          <DisplacementSphere />
          <TransitionGroup component={null}>
            {isMounted &&
              items.map((item, i) => (
                <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                  <div style={{ transitionDelay: `${i + 1}00ms`, zIndex: 1 }}>{item}</div>
                </CSSTransition>
              ))}
          </TransitionGroup>
        </>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
