import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledSkillsSection = styled.section`
  max-width: 850px;

  .inner {
    max-width: 800px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 30px;

    @media (max-width: 768px) {
      margin-left: 10px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

const StyledSkillColumn = styled.div`
  margin-bottom: 20px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
    color: var(--white);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
  }

  h3 {
    margin-bottom: 10px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;
    color: var(--green);
  }
`;

const Skills = () => {
  const data = useStaticQuery(graphql`
    query {
      skills: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/skills/" } }
        sort: { fields: [frontmatter___index], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
            }
            html
          }
        }
      }
    }
  `);

  const skillsData = data.skills.edges;

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
    <StyledSkillsSection id="skills" ref={revealContainer}>
      <h2 className="numbered-heading">Skillset</h2>

      <div className="inner">
        {skillsData &&
          skillsData.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { title } = frontmatter;

            return (
              <StyledSkillColumn key={i}>
                <h3>{title}</h3>
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </StyledSkillColumn>
            );
          })}
      </div>
    </StyledSkillsSection>
  );
};

export default Skills;
