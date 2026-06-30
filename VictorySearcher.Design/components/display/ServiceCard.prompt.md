Branded service/offering block: uppercase display title, muted description, "›" affordance top-right. The card chrome only appears when `active` or hovered — matching the "Комплексное продвижение" grid where one block is highlighted.

```jsx
<ServiceCard title="Укрепим доверие" active>
  Поднимем рейтинг на Яндекс.Картах, Google, 2GIS и других сервисах.
</ServiceCard>
```

Lay several in a CSS grid; set `active` on the one you want lit.
