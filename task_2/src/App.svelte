<script lang="ts">
  import {apiKey} from "./lib/apiKey";
  import {onMount} from "svelte";

  // Задаем константы для чисел, чтобы в будущем, использовать их при конвертации
  const firstFieldName: string = 'firstNumber';
  const secondFieldName: string = 'secondNumber';
  const currencyFirstName: string = 'currencyFirstName';
  const currencySecondName: string = 'currencySecondName';

  //Задаем изменяемые переменные, для расчетов, а также, пустышку массива, для валют
  let currencyFirst: string = "RUB";
  let currencySecond: string = "USD";
  let firstValue: number = 1;
  let secondValue: number = 1;
  let allCurrencies: string[] = [];

  //Получение списка валют и их текущих значений
  function fetchedCurrencies(url: string) {
    return new Promise((resolve, reject) => {
      fetch(url)
              .then(res => {
                if (!res.ok) {
                  return new Error(res.statusText);
                }
                return res.json()
              })
              .then(data => resolve(data))
              .catch(err => {
                console.log(err);
              });
    });
  }
 // Здесь уже получаем конкретные значения
  function getData(baseCurrency: string, targetCurrency: string) {
    const apiUrl: string = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${baseCurrency}/${targetCurrency}`;

    return new Promise((resolve, reject) => {
      fetch(apiUrl)
              .then(res => res.json())
              .then(dat => {
                resolve(parseFloat(dat.conversion_rate.toFixed(4)))
              })
              .catch(err => {
                console.log(err);
              })
    })
  }

  //Функция конвертера, в которой, происходит конвертация
  function converter(baseCurrency: string, targetCurrency: string, value: number) {
    return new Promise((resolve, reject) => {
      getData(baseCurrency, targetCurrency)
              .then(converted => {
                resolve(converted * value);
              })
              .catch(err => {
                console.log(err);
              })
    })
  }

  //Сюда мы закидываем значения и присваиваем новое
  function conversion() {
    converter(currencyFirst, currencySecond, firstValue)
            .then((res) => (secondValue = res))
  }

  //Изменение значений
  function changeValues(event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value) || 0;
    const name = (event.target as HTMLInputElement).name;

    switch (name) {
      case firstFieldName: {
        converter(currencyFirst, currencySecond, value)
                .then(res => secondValue = res)
      }
      case secondFieldName: {
        converter(currencySecond, currencyFirst, value)
      }
    }
  }

  //Изменение курса валют
  function changeCurrency(event: Event) {
    const { value, name } = event.target as HTMLInputElement;

    switch (name) {
      case currencyFirstName: {
        converter(value, currencySecond, firstValue)
                .then(res => secondValue = res)
      }

      case currencySecondName: {
        converter(currencyFirst, value, firstValue)
                .then(res => secondValue = res)
      }
    }

  }

  //Здесь, мы при монтаже, подгружаем возможные валюты
  onMount(() => {
    const savedCurrencies = sessionStorage.getItem('allCurrencies');
    if (savedCurrencies) {
      allCurrencies = JSON.parse(savedCurrencies);
    } else {
      const apiUrl: string = `https://v6.exchangerate-api.com/v6/${apiKey}/codes`;
      fetchedCurrencies(apiUrl)
              .then(data => {
                if (data && data.supported_codes) {
                  allCurrencies = data.supported_codes;
                  sessionStorage.setItem('allCurrencies', JSON.stringify(data.supported_codes));
                }
                conversion();
              })
              .catch(err => console.log(err));
    }
  });



</script>

<main>
  <section class="converter">
    <h1 class="title">Конвертер валют</h1>
    <div class="currency">
      <fieldset class="fieldset">
        <select class="selector" name={firstFieldName} bind:value = {currencySecond} on:change={changeCurrency}>
          {#each allCurrencies as currency}
            <option value={currency[0]}>
              {currency[1]}
            </option>
          {/each}
        </select>
        <input type="number" class="value" name={firstFieldName} bind:value = {firstValue} on:input = {changeValues} min="0">
      </fieldset>
      <fieldset class="fieldset">
        <select class="selector" name={secondFieldName} bind:value = {currencySecond} on:change={changeCurrency}>
          {#each allCurrencies as currency}
            <option value={currency[0]}>
              {currency[1]}
            </option>
          {/each}
        </select>
        <input type="number" class="value" name={secondFieldName} bind:value = {secondValue} on:input = {changeValues} min="0"/>
      </fieldset>
    </div>
  </section>
</main>

<style>
  .converter {
    max-width: 1200px;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .currency {
    max-width: 1000px;
    width: 100%;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  .fieldset {
    border: none;
    width: 100%;
    max-width: 500px;
    margin: 0;
    padding: 0;
  }

  .selector {
    width: 100%;
    max-width: 50px;
    height: 30px;
    margin: 0;
    padding: 0;
  }

  .value {
    width: 100%;
    max-width: 130px;
    height: 30px;
    margin: 0;
    padding: 0;
  }
</style>