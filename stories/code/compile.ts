const template = `
  <h1><%= data.title %><h1>
  <% for(let key in data ) {%>
    <% if (data.subtitle) { %>
        <h2><%= data.subtitle %></h2>
      <% } %>
  <% } %>
  
`;

function compile(template:string, data: object) {
  const varReg = /<%=(.*)%>/g
  const expReg = /<%(.*)%>/g
  
  const codeStart = `const code = [];code.push(\``
  const codeFragment = template.replace( varReg, (matchStr, p1) => {
    return `\`); code.push(${p1}); code.push (\``
  }).replace( expReg, (matchStr, p1) => {
    return `\`); ${p1} code.push (\``
  })
  const codeEnd = `\`); return code.join('')`
  
  const fun = new Function('data', `${codeStart}${codeFragment}${codeEnd}`)
  return fun(data)
}



export function excute() {
    const html = compile(template, {title: 'hello', subtitle: 'world'})
    return html
}