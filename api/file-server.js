const express = require('express')
const router = express.Router()

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const project = req.body.project
        const uploadPath = path.join(__dirname, '../uploads', project)
        fs.mkdirSync(uploadPath, { recursive: true })
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const version = req.body.version || '0.1.1'
        const filename = path.parse(file.originalname).name + '_v' + version + path.extname(file.originalname)
        cb(null, filename)
    }
})

const upload = multer({ storage })

router.post('/upload', upload.single('file'), (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            throw new Error('파일이 없다!');
        }
        const project = req.body.project
        const directoryPath = path.join(__dirname, '../uploads', project)
        const files = fs.readdirSync(directoryPath)
        res.status(200).json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

router.get('/download/:project/:filename', (req, res) => {
    try {
        const { project, filename } = req.params
        const filepath = path.join(__dirname, '../uploads', project, filename)

        // res.download(filepath, filename)
        if (fs.existsSync(filepath)) return res.download(filepath, filename)
        res.status(404).json({ error: '파일 없음'})
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

router.get('/files/:project', (req, res) => {
    const project = req.params.project
    const directoryPath = path.join(__dirname, '../uploads', project)

    if(fs.existsSync(directoryPath)) {
        fs.readdir(directoryPath, (err, files) => {
            if (err) { 
                console.error(err)
                return res.status(500).json({ error: '파일을 찾을 수 없음'})
            }
    
            res.json(files)
        })
    }

    else res.json()
})

router.delete('/file/:project/:filename', async (req, res) => {
    try {
        const { project, filename } = req.params
        const directoryPath = path.join(__dirname, '../uploads', project)
        const filepath = path.join(__dirname, '../uploads', project, filename)

        fs.unlinkSync(filepath)
        const files = fs.readdirSync(directoryPath)
        res.json(files)
        
    } catch (err) {
        console.error(err)
        res.json()
    }
})

router.get('/version/:project', async (req, res) => {
    const project = req.params.project
    const dirPath = path.join(__dirname, '../uploads', project)
    const files = fs.readdirSync(dirPath)

    // 파일 목록을 수정 시간순으로 정렬
    files.sort((a, b) => {
        const aTime = fs.statSync(path.join(dirPath, a)).mtime;
        const bTime = fs.statSync(path.join(dirPath, b)).mtime;
        return bTime - aTime;
    });

    const latestFile = files[0]
    let version = latestFile.split('_v')[1].replace('.apk', '')

    res.json({ version })
})

router.post('/add-project', async (req, res) => {
    let resultCode = 0, jsonData
    try {
        const newProject = req.body
        const filepath = path.join(__dirname, '../static', 'projects.json')
        const json = fs.readFileSync(filepath)
        jsonData = JSON.parse(json)
        jsonData.push(newProject)

        fs.writeFileSync(filepath, JSON.stringify(jsonData, null, 2))

        resultCode = 1
    } catch (err) {
        console.error(err)
    }
    res.json({ resultCode, projects: jsonData })
})

module.exports = router