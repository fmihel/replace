# replace
batch modify files by pattern

Пакетный поиск-замена в файлах. Использую в основном при сборке проекта.

1. Установка

```bash
$ npm i fmihel/replace -D
```

2. Использования
```bash
    $ node node_modules/fmihel-replace
```

3. Задание правил и конфигурация

По умолчанию поиск конфигурации осуществляется в папке, где лежит каталог ``node_modules``
в файле ```replace.config.json```. Так же можно указать свой конфиг, указав первым аргументом в строке запуска ```$ node node_modules/fmihel-replace my-config.json```

Пример конфигурации:
```json
{
    "replace":[
        {
            "files":["./file.txt","./dist/config.txt"],
            "rules":[
                { "search": "replace", "replace": "copy" }
            ]
        }
    ],
    "delete":[
        "./for.del",
        "./dist/*.json"
    ]
}
```
