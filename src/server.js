const express = require('express')
const ejs = require('ejs')
const path = require('path')
const puppeteer = require('puppeteer')
const programacao = require('./programacao.json');
const app = express()


app.get('/pdf', async (request, response) => {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('http://localhost:3000/', {
        waitUntil: 'networkidle0'
    })

    const pdf = await page.pdf({
        printBackground: true,
        landscape: true,
        margin: {
            top: '25px',
            right: '40px',
            bottom: '25px',
            left: '40px'
        },
    })

    await browser.close()

    response.contentType("application/pdf")
    return response.send(pdf)
})

app.get('/', (request, response) => {

    const filePath = path.join(__dirname, "print.ejs")

    ejs.renderFile(filePath, { programacao }, (err, html) => {
        if (err) {
            return response.send('Erro na leitura do arquivo')
        }

        // enviar para o navegador
        return response.send(html)
    })

})

app.listen(3000)
