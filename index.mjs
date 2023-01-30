import chalk from 'chalk'
import inquirer from 'inquirer'
import prompt from 'prompt-sync'
import fs from 'fs'

menu()

//Menu com as opções para o usuário
function menu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Clique Enter na Opção desejada',
        choices: [
          'Adicionar propriedade CSS',
          'Exibir lista de propriedades CSS',
          'Remover propriedade CSS',
          'Sair',
        ],
      },
    ])
    .then((answer) => {
      const action = answer['action']

      if (action === 'Exibir lista de propriedades CSS') {
        ExibirLista()
      } else if (action === 'Adicionar propriedade CSS') {
        CriarLista()
      } else if (action === 'Remover propriedade CSS') {
        RemoverPropriedade()
      } else if (action === 'Sair') {
        console.log(chalk.bgBlue.black('ATÉ LOGO!')) 
        process.exit()
      }
    })
}

const command = prompt()

//Cria a lista com as regras e faz tratamento de erro
const CriarLista = (entrada) => {
  let propriedades = []
  while (entrada != "sair") {
    entrada = command("Insira uma propriedade CSS:")
    if(propriedades.indexOf(`"${entrada}"`) == -1 && entrada != 'sair'){
      propriedades.push(`"${entrada}"`);
    } else if(entrada == 'sair'){
      console.log(chalk.bgGreen.black('Lista finalizada')) 
    } else if(propriedades.indexOf(`"${entrada}"`) != -1){
      console.log(chalk.red("Esta propriedade já foi adicionada, escolha outra!")) 
    }
  }
  let resultado = propriedades.sort().join("\n") //Guarda a lista em ordem alfabética 
  console.log(resultado)
  Json(propriedades)
}

//Criação de arquivo com lista
function Json(propriedades) {  
  console.log(propriedades)
  inquirer.prompt([ 
    {
      name: 'arquivo',
      message: 'Deseja criar um arquivo com a lista?:',
    },
  ])
  .then((answer) => {
    if(answer.arquivo == 'sim'){
      console.info(answer['arquivo'])

      const lista = 'CSS'
  
      if (!fs.existsSync('propriedades')) {
        fs.mkdirSync('propriedades')
      }
  
      if (fs.existsSync(`propriedades/${lista}.json}`)) {
        console.log(chalk.bgBlue.black('Lista atualizada!'),)
      }

      fs.writeFileSync(`propriedades/${lista}.json`, `{"propriedades": [${propriedades}]}`, //criação do arquivo
      function (err){
        console.log(err)
      },)

      console.log(chalk.green('O arquivo com a lista foi criado'))
      menu()

    } else {
      console.log(chalk.bgBlue.black('ATÉ LOGO!'))
      menu()
    }
  })
}

//Exibir listas
function ExibirLista() {
  var jsonData = fs.readFileSync("propriedades/CSS.json", "utf8");
  var list = JSON.parse(jsonData);
  var newList = list.propriedades
  console.log(newList.sort().join("\n"))
  menu() //volta para o menu
}

//Removendo Propriedade
function RemoverPropriedade(){
  inquirer
    .prompt([
      {
        name: 'remove',
        message: 'Digite a propriedade CSS para ser removida:',
      },
    ])
    .then((answer) => {
      let propCSS = answer['remove']

      var jsonData = fs.readFileSync("propriedades/CSS.json", "utf8");

      var list = JSON.parse(jsonData);
      var newList = list.propriedades;
    
      if (newList.includes(propCSS)) {
        let busca = propCSS
        let index = newList.indexOf(busca);
        while(index >= 0){
          newList.splice(index, 1);
          index = newList.indexOf(busca);}

        console.log(chalk.bgGreen.black('Propriedade CSS removida!'))
        console.log(newList.sort().join("\n"))
        fs.writeFileSync(`propriedades/CSS.json`, `{"propriedades": ["${newList}"]}`)
        menu() 
      }
      else {
        console.log(chalk.bgRed.black('Esta propriedade já foi removida, escolha outra!'))
        console.log(newList.sort().join("\n"))
        RemoverPropriedade()
      }
    })
 }