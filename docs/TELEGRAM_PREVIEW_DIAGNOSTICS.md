# Telegram preview investigation — 2026-11-15

Status: unresolved. HTTP probes are successful; a real Telegram client still fails to create a preview. No claim that the host or Telegram is the proven cause.

## Reproduction

- Movie: https://horroreiro.ru/movie/nenavizhu-naydennye-plyonki-2026
- Fresh query checked by the owner: `?preview_check=20261115b`.
- Static page without database calls: https://horroreiro.ru/preview-test/astral-20261006-a?check=20261115b
- Same static page on the gateway: https://d5d0nq3qlmgiogqk1kjo.0ly8ed4d.apigw.yandexcloud.net/preview-test/astral-20261006-a?check=20261115b
- All three hang at loading in Telegram; after sending, only the link remains. The owner supplied a screenshot. https://telegram.org/ produces a normal preview in the same client/chat.

Query parameters do not prove a clean Telegram cache: canonical/OG URLs and image URLs remain the same. Neither cache state nor the actual Telegram fetch is observable from the successful local probes.

## Verified from this workstation

- Movie GET with `TelegramBot (like TwitterBot)` returns 200 and initial Open Graph HTML without JavaScript (3106 bytes). Its first-party image returns 200, `image/jpeg`, 122632 bytes, baseline JPEG 1200×630.
- The static diagnostic HTML/image also return 200. Movie data, JavaScript execution and dynamic image generation are therefore absent from that diagnostic path, but real Telegram retrieval has not been observed.
- TLS 1.2 and 1.3 validate for apex and gateway. Different certificate chains are used (apex YR1; gateway GlobalSign). Apex public DNS A is `158.160.184.183`; Google DNS reported no AAAA answer.
- Local Node HEAD for `/og-preview.jpg` preserves GET length 233765. Production HEAD reports `Content-Length: 0`, for both HTML and images. The same difference occurs when invoking the private container directly with existing IAM authentication, bypassing API Gateway. Credentials were neither logged nor persisted in the report.
- This HEAD difference is a hosting-layer defect candidate, not a proven cause of Telegram failure. RFC 9110 §§8.6/9.3.2 requires any Content-Length sent on HEAD to match the corresponding GET representation: https://www.rfc-editor.org/rfc/rfc9110.html#section-8.6
- Runtime `e2cfca22993edf0a41003d1192d8a44bf7253af6` adds `Vary: User-Agent` to both movie HTML representations. This addresses shared-cache variation, not confirmed end-to-end Telegram behavior.

## Diagnostic request correlation (UTC)

These are our own HTTP probes, **not observed Telegram requests**. User-Agent: `horroreiro-preview-diagnostics/1.0`; Accept-Encoding: identity.

| Time 2026-11-15 | Target | Method | Status / bytes / Content-Length | X-Request-ID |
| --- | --- | --- | --- | --- |
| 14:08:32.979 | Apex static diagnostic | GET | 200 / 1854 / 1854 | e9898175-0a7e-4c97-b8de-d5c3525c3075 |
| 14:08:33.067 | Apex static diagnostic | HEAD | 200 / 0 / 0 | abf2eb28-6ed5-4348-ab95-9a7817945253 |
| 14:08:33.939 | Gateway static diagnostic | GET | 200 / 2006 / 2006 | a23c4a1e-8360-4e79-ad5f-5a0696acba47 |
| 14:08:34.008 | Gateway static diagnostic | HEAD | 200 / 0 / 0 | ddb95d7b-9ec3-4ba3-916e-ff093a6d8c3d |

## Observability blocker

Cloud Logging CLI and REST return Unavailable/503. After signing in with the correct production account, its console shows the section unavailable due to limited platform operation. The official status board at https://center.yandex.cloud/statusboard (updated 15 November, 17:08 MSK) lists Cloud Logging as unavailable and logs for API Gateway/Serverless Containers as temporarily unavailable. Monium itself is operational, but the status board explicitly identifies missing logs for these hosting services; their recovery/migration has not been established here.

## Prepared request to Yandex support — not sent

Тема: Telegram не получает превью с API Gateway / Serverless Containers; HEAD возвращает Content-Length: 0

Проект Horroreiro: каталог `b1gbmfo87hnlg1pfos0f`, gateway `d5d0nq3qlmgiogqk1kjo`, private container `bbasbracev0l37jj4qdr`, revision `bbakjsmqb4m1bg1ne138`.

Telegram зависает на загрузке превью как для нашего домена, так и для штатного домена gateway. Выше приведены минимальная статическая страница, контрольная проверка, результаты HTTP/TLS и идентификаторы запросов. Из нашей сети GET успешны. HEAD на локальном Node сохраняет длину GET, а через Serverless Containers получает Content-Length: 0, включая прямой авторизованный вызов контейнера.

Просим проверить доступность этих endpoints из сети загрузчиков Telegram, возможные ограничения на стороне платформы и изменение Content-Length у HEAD. Нельзя подтвердить, доходят ли реальные запросы Telegram до инфраструктуры: Cloud Logging и логи этих сервисов сейчас официально недоступны. Просим подсказать доступный способ корреляции таких запросов или предоставить диагностику на стороне платформы. Нулевой Content-Length рассматриваем как отдельное наблюдение, а не доказанную причину ошибки Telegram.
