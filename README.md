# Практична робота №5

Тема: Робота з модулями та Dependency Injection у NestJS.

Варіант 10: Зоотовари.

Студент: Тарновський Артур КН-41

## Мета роботи

Ознайомитися з модульною архітектурою NestJS, навчитися створювати власні модулі та налаштовувати взаємодію між ними за допомогою механізму Dependency Injection. Навчитися використовувати різні способи реєстрації та впровадження залежностей, а також працювати з хуками життєвого циклу (`OnModuleInit`) та областями видимості провайдерів (`Scope.REQUEST`).

## Встановлені залежності

У процесі розроблення використовувалися:

- **Node.js** — середовище виконання JavaScript.
- **npm** — менеджер пакетів.
- **NestJS** — серверний фреймворк для розроблення застосунків.
- **TypeScript** — мова програмування.
- **Thunder Client** — інструмент для тестування REST API.

## Структура проєкту

Основні файли та директорії проєкту:

    pr5-pet-supplies/
    ├── src/
    │   ├── pet-supplies/
    │   │   ├── dto/
    │   │   │   ├── create-pet-supply.dto.ts
    │   │   │   └── update-pet-supply.dto.ts
    │   │   ├── entities/
    │   │   │   └── pet-supply.entity.ts
    │   │   ├── pet-supplies.controller.ts
    │   │   ├── pet-supplies.module.ts
    │   │   └── pet-supplies.service.ts
    │   │
    │   ├── orders/
    │   │   ├── dto/
    │   │   │   └── create-order.dto.ts
    │   │   ├── entities/
    │   │   │   └── order.entity.ts
    │   │   ├── orders.controller.ts
    │   │   ├── orders.module.ts
    │   │   └── orders.service.ts
    │   │
    │   ├── shared/
    │   │   ├── config/
    │   │   │   └── app-config.provider.ts
    │   │   ├── request-id/
    │   │   │   └── request-id.service.ts
    │   │   ├── slug/
    │   │   │   └── slug.service.ts
    │   │   └── shared.module.ts
    │   │
    │   ├── app.module.ts
    │   └── main.ts
    ├── package.json
    ├── tsconfig.json
    ├── requests.http
    └── README.md

## Опис реалізації

### 1. Створення модулів

Для розділення функціональності застосунку було створено декілька модулів.

**PetSuppliesModule** — відповідає за роботу із зоотоварами. Реєструє `PetSuppliesController` та `PetSuppliesService`, імпортує `SharedModule` для використання спільних залежностей та експортує `PetSuppliesService`.

**OrdersModule** — відповідає за створення та перегляд замовлень. Імпортує `PetSuppliesModule` для отримання інформації про зоотовари та `SharedModule` для використання спільних сервісів і провайдерів.

**SharedModule** — містить спільні для застосунку залежності. Реєструє та експортує `SlugService`, `RequestIdService`, конфігурацію магазину `STORE_CONFIG` та калькулятор податку `FEE_CALCULATOR`.

### 2. SlugService

Створено сервіс `SlugService`, який відповідає за формування URL-дружніх ідентифікаторів на основі назв зоотоварів.

Метод `generateSlug(title)`:

- виконує транслітерацію кирилиці;
- видаляє зайві пробіли та спецсимволи;
- переводить текст у нижній регістр;
- замінює послідовності пробілів на дефіси.

Сервіс використовується в `PetSuppliesService` під час створення або оновлення товару, щоб автоматично додавати поле `slug`.
<img width="1293" height="414" alt="image" src="https://github.com/user-attachments/assets/0d882383-8812-4618-bde9-f7310f769e6c" />

### 3. Конфігурація магазину

Для зберігання налаштувань магазину створено провайдер `STORE_CONFIG`.

Він містить такі параметри:

- `storeName` — назва магазину;
- `defaultCurrency` — валюта за замовчуванням (`UAH`);
- `taxPercent` — відсоток податку (`20`).

Для реєстрації конфігурації використовується `useValue`, що дозволяє передати готовий об'єкт як залежність.

### 4. FeeCalculator

Створено провайдер `FEE_CALCULATOR`, який відповідає за обчислення суми податку.

Для його створення використовується `useFactory`. Фабрика отримує конфігурацію магазину `STORE_CONFIG` через `inject` та повертає об'єкт із методом `calculateTax(amount)`.

Таким чином, розмір податку визначається на основі значення `taxPercent` із конфігурації магазину.

### 5. OrdersService

Створено сервіс `OrdersService`, який відповідає за формування замовлень.

Для роботи сервіс використовує впроваджені залежності:

- `PetSuppliesService` — для перевірки наявності та отримання інформації про замовлений зоотовар;
- `STORE_CONFIG` — для отримання валюти магазину;
- `FEE_CALCULATOR` — для обчислення податку.

Під час створення замовлення виконується така послідовність дій:

1. Отримання зоотовару за його ідентифікатором (якщо товар не знайдено — повертається `404 Not Found`).
2. Обчислення вартості замовлення без податку (`subtotal`).
3. Розрахунок суми податку (`taxAmount`).
4. Обчислення загальної вартості (`total`).
5. Створення замовлення з унікальним ідентифікатором та збереження його в масиві.

### 6. Dependency Injection, Lifecycle Hooks та Scope

У роботі використано механізм Dependency Injection, який дозволяє передавати необхідні залежності класам через конструктор.

Для впровадження залежностей та керування життєвим циклом застосовано:

- звичайне впровадження сервісів через конструктор;
- декоратор `@Inject()` для провайдерів із токенами `STORE_CONFIG` та `FEE_CALCULATOR`;
- `useValue` для реєстрації готової конфігурації;
- `useFactory` для створення провайдера на основі іншої залежності;
- інтерфейс `OnModuleInit` у `PetSuppliesService` та `OrdersService` для автоматичного початкового заповнення каталогу тестовими зоотоварами під час старту програми;
- `RequestIdService` зі скоупом `Scope.REQUEST` для генерації унікального ідентифікатора на кожен HTTP-запит.

## Тестування API

Тестування виконувалося за допомогою розширення Thunder Client у Visual Studio Code.

### 1. Отримання списку зоотоварів (GET)

Запит:

    GET http://localhost:3000/pet-supplies

Результат: отримано список початкових зоотоварів, завантажених через хук `OnModuleInit`, разом з унікальним `requestId` поточного запиту. Статус відповіді — `200 OK`.
<img width="1355" height="696" alt="image" src="https://github.com/user-attachments/assets/19db8f4d-1fab-418d-9eb3-5cbf3d021445" />

### 2. Створення нового зоотовару (POST)

Запит:

    POST http://localhost:3000/pet-supplies

Тіло запиту:

    {
      "title": "Кігтеточка-стовпчик Trixie для котів",
      "category": "Аксесуари",
      "petType": "Коти",
      "price": 850,
      "stock": 10
    }

Результат: товар успішно створено, сервіс `SlugService` автоматично згенерував поле `"slug": "kihtetochka-stovpchyk-trixie-dlya-kotiv"`. Статус відповіді — `201 Created`.
<img width="1290" height="433" alt="image" src="https://github.com/user-attachments/assets/f1d6ee4f-7eed-483f-a0b4-81f44c363179" />

### 3. Створення замовлення (POST)

Запит:

    POST http://localhost:3000/orders

Тіло запиту:

    {
      "productId": "pet-1",
      "quantity": 2,
      "customerEmail": "tarnovskyi.artur@student.edu.ua"
    }

Результат: замовлення успішно створено. У відповіді міститься інформація про зоотовар, кількість, вартість без податку (`subtotal`), суму податку (`taxAmount` — 20%) та загальну вартість (`total`). Статус відповіді — `201 Created`.
<img width="1292" height="420" alt="image" src="https://github.com/user-attachments/assets/6ac5470d-8f78-4bcb-a253-00684ab74738" />

### 4. Створення замовлення з неіснуючим товаром (POST)

Запит:

    POST http://localhost:3000/orders

Тіло запиту:

    {
      "productId": "pet-999",
      "quantity": 1
    }

Результат: оскільки товару з таким ідентифікатором немає в каталозі, сервер повернув помилку `404 Not Found`.
<img width="1316" height="337" alt="image" src="https://github.com/user-attachments/assets/39ad1142-3392-4aeb-9f01-6b845e926310" />

### 5. Отримання списку замовлень (GET)

Запит:

    GET http://localhost:3000/orders

Результат: отримано список усіх оформлених замовлень. Статус відповіді — `200 OK`.
<img width="1303" height="844" alt="image" src="https://github.com/user-attachments/assets/71e8171c-a7c8-4c76-be8c-a96ea9996c0d" />

## Висновок

Під час виконання цієї практичної роботи було ознайомлено з модульною архітектурою NestJS, принципами інкапсуляції та експорту сервісів між модулями, створенням кастомних провайдерів (`useValue` та `useFactory`), а також використанням хука життєвого циклу `OnModuleInit` та області видимості `Scope.REQUEST`.
