export const monthsWord = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
]

export const years = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
]

export const monthsDigit = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
]

export const languages = ['Javascript', 'Java', 'Python', 'CSS', 'PHP', 'Ruby', 'C++', 'C', 'Shell', 'C#', 'HTML', 'Go', 'Typescript',
  'Swift', 'Scala'
]

// period in format YYYY-MM
export const LANGUAGE_REPOS_QUERY = (period, gql) => gql`
  query {
  rateLimit {
    cost
    remaining
    resetAt
  }
  ALL: search (
    type: REPOSITORY
    query: "created:${period}"
  ) {
    repositoryCount
  }
  ${languages.reduce((total, elem) => total + addLanguageNode(elem, period), '')}
  }
`

export const addLanguageNode = (language, period) => `
${language.replace('++', 'plusplus').replace('#', 'sharp')}: search (
    type: REPOSITORY
    query: "created:${period} language:${language}"
  ) {
    repositoryCount
  }
`

export const NEW_REPOS_QUERY = (from, to, language, gql) => gql`
  query {
  rateLimit {
    cost
    remaining
    resetAt
  
  }
  ${generateMonths(from, to, language)}
}
`
export const generateMonths = (from, to, language) => {
  let output = ``
  let current = from
  let limit = 0
  while (current !== to && limit < 120) {
    // add node to GQL query
    output += `${addMonthNode(current.slice(0, 3), `20${current.slice(3)}`, language)}`
    // increment year if required
    if (current.slice(0, 3) === 'dec') {
      current = `jan${parseInt(current.slice(3)) + 1}`
    }
    // otherwise increment month
    else {
      current = `${monthsWord[monthsWord.indexOf(current.slice(0, 3)) + 1]}${current.slice(3)}`
    }
    limit++
  }
  return output
}

export const addMonthNode = (month, year, language) =>
  `
${month}${year.slice(2)}: search (
    type: REPOSITORY
    query: "created:${year}-${monthsDigit[monthsWord.indexOf(month)]} language:${language}"
  ) {
    repositoryCount
  } 
`