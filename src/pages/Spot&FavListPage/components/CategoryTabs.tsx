const [category, setCategory] = useState("tour");

<CategoryTabs
    category={category}
    onChange={setCategory}
/>

<button>観光</button>
<button>グルメ</button>
<button>体験</button>