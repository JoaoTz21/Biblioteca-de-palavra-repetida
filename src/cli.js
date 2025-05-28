import fs from "fs";
import path from "path";
import trataErros from "./erros/erros.js";
import { contaPalavras } from "./index.js";
import { montaSaidaArquivo } from "./helpers.js";
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

program
  .version("0.0.1")
  .option("-t, --texto <string>", "caminho do texto a ser processado")
  .option("-d, --destino <string>", "É o caminho da pasta onde vai ser salvo o arquivo de resultados")
  .action((options) => {
    const { texto, destino } = options;

    if(!texto || !destino) {
      console.log(chalk.red("Erro, favor inserir caminho de origem e destino!"));
      program.help();
      return;
    }
    
    const caminhoTexto = path.resolve(texto);
    const caminhoDestino = path.resolve(destino);


    try{
      processarArquivo(caminhoTexto, caminhoDestino);
      console.log(chalk.green("Texto Processado!"));
    }catch (erro) {
      console.log("Ocorreu um erro no processamento!", erro);
    }
});

program.parse();

function processarArquivo(texto, destino){
  fs.readFile(texto, "utf-8", (erro, texto) => {
    try{
    if (erro) throw erro;
    const resultado = contaPalavras(texto);
    criaESalvaArquivo(resultado, destino);
    } catch(erro) {
      console.log(trataErros(erro));
    }
    });
}

async function criaESalvaArquivo(listaPalavras,endereco){
  const arquivoNovo = `${endereco}/resultado.txt`;
  const textoPalavras = montaSaidaArquivo(listaPalavras);
  try {
    await fs.promises.writeFile(arquivoNovo, textoPalavras);  
    console.log(chalk.green("Texto processado com sucesso!"));
  } catch(erro){
    throw erro;
  }
};
