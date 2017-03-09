#! /usr/bin/env node
'use strict';
import program from 'commander'
import Bartlby from '../'

program
  .version('0.0.1')
  .description('List files and folders')
  .option('-a, --all [type]', 'Add the specified type of cheese [marble]', 'marble')
  .option('-l, --long [type]','asdas', "def")
  
program.parse(process.argv);


//console.log(program.all)
//console.log(program.long)


var bartlby = new Bartlby({});
bartlby.start();

