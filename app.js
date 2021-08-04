const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const puerto = process.env.PUERTO || 3000
app.listen(puerto, function () {
    console.log("Servidor Ok en puerto:" + puerto)
})

app.get('/', function (req, res) {
    res.send('Inicio')
})

app.get('/movies', (req, res) => {

    fs.readFile('movies.json', (error, file) => {

        if (error) {
            console.log("No se puede leer el archivo", error);
            return
        }
        const movies = JSON.parse(file)
        return res.json(movies)
    })
})

app.post('/movies', (req, res) => {

    fs.readFile('movies.json', (err, data) => {

        if (err) {
            console.log("No se puede leer el archivo", err);
        }
        const movies = JSON.parse(data)
        const newMovieID = movies.length + 1;
        req.body.id = newMovieID;
        movies.push(req.body);

        const newMovie = JSON.stringify(movies, null, 2);

        fs.writeFile('movies.json', newMovie, (err) => {
            if (err) {
                console.log("Error de escritura", err);
            }

            return res.status(200).send("movie added")


        })
    })

})

app.patch('/movie/:id', (req, res) => {

    const mid = req.params.id;
    const { name, year } = req.body;

    fs.readFile('movies.json', (err, data) => {

        if (err) {
            console.log("No se puede leer el archivo", err);

        }
        const movies = JSON.parse(data)

        movies.forEach(movie => {
            if (movie.id === Number(mid)) {

                if (name != undefined) {
                    movie.name = name;
                }
                if (year != undefined) {
                    movie.year = year;
                }

                const movieUpdated = JSON.stringify(movies, null, 2)

                fs.writeFile('movies.json', movieUpdated, (err) => {
                    if (err) {
                        console.log("Error de escritura", err);
                    }

                    return res.status(200).json({ message: "movie updated" })


                })


            }
        })
    })
})

app.delete('/movie/:id', (req, res) => {

    const mid = req.params.id;

    fs.readFile('movies.json', (err, data) => {

        if (err) {
            console.log("No se puede leer el archivo", err);

        }
        const movies = JSON.parse(data)
        movies.forEach(movie => {
            if (movie.id === Number(mid)) {

                movies.splice(movies.indexOf(movie), 1)
                const movieDeleted = JSON.stringify(movies, null, 2)

                fs.writeFile('movies.json', movieDeleted, (err) => {
                    if (err) {
                        console.log("Error de escritura", err);
                    }

                    return res.status(200).json({ message: "movie deleted" })


                })


            }
        })
    })
})