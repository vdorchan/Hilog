const tdStyle = 'padding: 0 5px;font-size: 14px;font-family: SimSun;'
const thStyle = tdStyle + 'background: #BFBFBF;'

function genHtml (arr, name) {
  const html = ` <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>

    <body>
      <table style="font-size: 14px;border-color: #000;border-collapse: collapse;" border="1" width="529" cellspacing="0" cellpadding="0" collapse="true">
        <tbody>
          <tr>
            <th width="8.9%" height="22.9" align="center" style="${thStyle}">
              <p>
                <strong>前端</strong>
              </p>
            </th>
            <th width="40.6%" align="center" style="${thStyle}">
              <p>
                <strong>项目名称</strong>
              </p>
            </th>
            <th width="9.9%" align="center" style="${thStyle}">
              <p>
                <strong>进度</strong>
              </p>
            </th>
            <th width="40.5%" align="center" style="${thStyle}">
              <p>
                <strong>备注</strong>
              </p>
            </th>
          </tr>
${arr.map((log, i) => {
    var str = '<tr>'
    if (i === 0) {
      str += `<td rowspan="${arr.length}" align="center" style="${tdStyle}">${name}</td>`
    }
    str += `<td height="24.5" style="${tdStyle}">${log.itemName}</td>
    <td align="center" style="${tdStyle}">${log.itemProgress}</td>
    <td style="${tdStyle}">${log.itemRemark || ''}</td></tr>`
    return str
  }).join('')
}           </tbody> 
          </table>
        </body>
    </html>`

  return html.trim()
}

export default genHtml
