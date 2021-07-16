function getRandomList(num: number) {
  return Array.from({length: num}).map( () => Math.random() * num)
}

const randomList = getRandomList(10)


/**
 * 选择排序
 */
export function Sort1() {
  const list = [...randomList]
  console.time('Sort1')
  for (let i =0; i< list.length; i++) {
    let min = i
    for (let j=i; j < list.length; j++) {
      if (list[j] < list[min]) {
       min = j
      }
    }
    let temp = list[min]
    list[min] = list[i]
    list[i] = temp
  }
  console.timeEnd('Sort1')
  // console.log('list: ',list);
}

/**
 * 冒泡排序
 */
export function Sort2() {
  const list = [...randomList]
  console.time('Sort2')
  for (let i =0; i< list.length; i++) {
    for (let j=i; j < list.length; j++) {
      if (list[j] < list[i]) {
        let temp = list[i]
        list[i] = list[j]
        list[j] = temp
      }
    }
  }
  console.timeEnd('Sort2')
  // console.log(list);
}


/**
 * 插入排序
 */
export function Sort3() {
  const list = [...randomList]
  console.time('Sort3')
  for (let out =1; out< list.length; out++) {
    for (let left=out -1; left > -1; left--) {
      if(list[left]> list[out]) {
        list[left+1] = list[left]
        list[left] = list[out]
      }
      // if (list[j] < list[i]) {
      //   let temp = list[i]
      //   list[i] = list[j]
      //   list[j] = temp
      // }
    }
  }
  console.timeEnd('Sort3')
}
