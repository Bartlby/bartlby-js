#! /usr/bin/env node


import program from 'commander'
import Bartlby from '../'

program.
    version('0.0.1').
    description('List files and folders').
    option('-a, --all [type]', 'Add the specified type of cheese [marble]', 'marble').
    option('-l, --long [type]', 'asdas', "def")

program.parse(process.argv);


//Console.log(program.all)
//Console.log(program.long)


const bartlby = new Bartlby({});

bartlby.start();