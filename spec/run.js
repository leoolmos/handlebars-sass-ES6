import Jasmine from 'jasmine'
import suiteReporter from 'jasmine-suite-reporter'

const jasmine = new Jasmine();
//Register Reporter 
jasmine.addReporter(suiteReporter.create({
  includeStack: true
}));
jasmine.loadConfigFile('./spec/support/jasmine.json')
jasmine.execute()