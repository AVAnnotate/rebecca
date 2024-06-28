const fs = require('fs');
const { type } = require('os');

const parseFile = (file) => {

  const obj = JSON.parse(fs.readFileSync(file, 'utf8'));

  let copy = JSON.parse(JSON.stringify(obj));

  copy.annotations = [];
  obj.annotations.forEach(a => {
    const times = a.Time.split('-');

    const startTime = times[0].trim().split(':');
    const start_time = 60 * parseInt(startTime[0]) + parseInt(startTime[1]);

    let end_time;
    if (times[1]) {
      const endTime = times[1].trim().split(':');
      end_time = 60 * parseInt(endTime[0]) + parseInt(endTime[1]);
    } else {
      end_time = start_time
    }



    const annotation = [{
      type: 'paragraph',
      children: [{ text: a.Annotation }]
    }];
    const tags = [
      {
        "category": "speaker",
        "tag": a.Layer
      }
    ]

    copy.annotations.push({
      start_time,
      end_time,
      annotation,
      tags,
    })
  });

  fs.writeFileSync(file, JSON.stringify(copy));
}

parseFile(process.argv[2])