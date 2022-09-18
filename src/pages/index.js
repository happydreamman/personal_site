import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, Hero, About, Education, Jobs, Projects, Skills, Contact } from '@components';

const StyledMainContainer = styled.main`
  counter-reset: section;
  background-color: var(--dark-navy);
`;

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer className="fillHeight">
      <Hero />
      <About />
      <Education />
      <Jobs />
      <Projects />
      <Skills />
      <Contact />
    </StyledMainContainer>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
