describe('Home Page', () => {

  beforeEach(() => {
    //you should make sure that you are not running the back end server
    //make sure that the localhost:4200 in in cypress.json
    //in E2E testing we need a real HTTP request not as unit testing
    //we mock our back end => http response
    //no simulated version of the services
    //we use a real instance of courses service => real http request
    cy.fixture('courses.json').as("CoursesJSON");
    cy.server();
    //link the json with the /api/courses link so whenever this call happen, we return this json mock data
    cy.route('/api/courses', '@CoursesJSON').as('courses');
    cy.visit('/');
  })

  it('it should display a list of courses', () => {
    cy.contains('All Courses');
    cy.wait('@courses');
    cy.get('mat-card').should('have.length', 9);

  })

  it('it should display the advanced courses', () => {
    cy.get('.mat-tab-label').should('have.length', 2);
    cy.get('.mat-tab-label').last().click();//cypress take care of this asynchronous event
    cy.get('.mat-tab-body-active .mat-card-title').its('length').should('be.gt', 1);
    cy.get('.mat-tab-body-active .mat-card-title').first().should('contain', 'Angular Security Course')
  })
})
