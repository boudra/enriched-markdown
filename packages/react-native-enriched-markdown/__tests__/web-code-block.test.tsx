import { renderToStaticMarkup } from 'react-dom/server';
import { RenderNode } from '../src/web/renderers';
import { normalizeMarkdownStyle } from '../src/normalizeMarkdownStyle.web';
import { buildStyles } from '../src/web/styles';

const style = normalizeMarkdownStyle({});
const node = {
  type: 'CodeBlock' as const,
  attributes: { language: 'typescript' },
  children: [{ type: 'Text' as const, content: 'const value = 1;\n' }],
};

it('renders a code block using the supplied component and preserves source whitespace', () => {
  const html = renderToStaticMarkup(
    <RenderNode
      node={node}
      style={style}
      styles={buildStyles(style)}
      callbacks={{}}
      capabilities={{
        katex: null,
        enableTaskListItemToggle: true,
        renderers: {
          codeBlock: ({ code, language }) => (
            <section data-language={language}>
              <button>Copy</button>
              <pre>{code}</pre>
            </section>
          ),
        },
      }}
    />
  );
  expect(html).toBe(
    '<section data-language="typescript"><button>Copy</button><pre>const value = 1;\n</pre></section>'
  );
});

it('keeps the default code renderer when no override is supplied', () => {
  const html = renderToStaticMarkup(
    <RenderNode
      node={node}
      style={style}
      styles={buildStyles(style)}
      callbacks={{}}
      capabilities={{ katex: null, enableTaskListItemToggle: true }}
    />
  );
  expect(html).toContain('aria-label="Code block: typescript"');
  expect(html).toContain('const value = 1;\n</code></pre>');
});
