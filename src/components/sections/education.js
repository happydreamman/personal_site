import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledEducationSection = styled.section`
  max-width: 700px;

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    // Prevent container from jumping
    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;
  margin-bottom: 10px;
  margin-left: 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
    margin-left: 20px;
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .institution {
      color: var(--green);
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--white);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .description {
    color: var(--white);
  }
`;

const Education = () => {
  const data = useStaticQuery(graphql`
    query {
      education: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/education/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              institution
              degree
              range
            }
            html
          }
        }
      }
    }
  `);

  const educationData = data.education.edges;

  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    // If we're at the end, go to the start
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  return (
    <StyledEducationSection id="education" ref={revealContainer}>
      <h2 className="numbered-heading">Education</h2>

      <div className="inner">
        <StyledTabPanels>
          {educationData &&
            educationData.map(({ node }, i) => {
              const { frontmatter, html } = node;
              const { institution, degree, range } = frontmatter;

              return (
                <StyledTabPanel key={i}>
                  <h3>
                    <span className="institution">{institution}</span>
                  </h3>

                  <h3>{degree}</h3>
                  <p className="range">{range}</p>

                  <div className="description" dangerouslySetInnerHTML={{ __html: html }} />
                </StyledTabPanel>
              );
            })}
        </StyledTabPanels>
      </div>
    </StyledEducationSection>
  );
};

export default Education;
