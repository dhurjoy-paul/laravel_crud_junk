import {
    CHECK_LIST,
    ELEMENT_TRANSFORMERS,
    MULTILINE_ELEMENT_TRANSFORMERS,
    TEXT_FORMAT_TRANSFORMERS,
    TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useState } from 'react';

import { ContentEditable } from '@/components/editor/editor-ui/content-editable';
import { AutoLinkPlugin } from '@/components/editor/plugins/auto-link-plugin';
import { AutocompletePlugin } from '@/components/editor/plugins/autocomplete-plugin';
import { CodeActionMenuPlugin } from '@/components/editor/plugins/code-action-menu-plugin';
import { CodeHighlightPlugin } from '@/components/editor/plugins/code-highlight-plugin';
import { ContextMenuPlugin } from '@/components/editor/plugins/context-menu-plugin';
import { DragDropPastePlugin } from '@/components/editor/plugins/drag-drop-paste-plugin';
import { DraggableBlockPlugin } from '@/components/editor/plugins/draggable-block-plugin';
import { AutoEmbedPlugin } from '@/components/editor/plugins/embeds/auto-embed-plugin';
import { TwitterPlugin } from '@/components/editor/plugins/embeds/twitter-plugin';
import { YouTubePlugin } from '@/components/editor/plugins/embeds/youtube-plugin';
import { EmojiPickerPlugin } from '@/components/editor/plugins/emoji-picker-plugin';
import { EmojisPlugin } from '@/components/editor/plugins/emojis-plugin';
import { FloatingLinkEditorPlugin } from '@/components/editor/plugins/floating-link-editor-plugin';
import { FloatingTextFormatToolbarPlugin } from '@/components/editor/plugins/floating-text-format-plugin';
import { ImagesPlugin } from '@/components/editor/plugins/images-plugin';
import { KeywordsPlugin } from '@/components/editor/plugins/keywords-plugin';
import { LayoutPlugin } from '@/components/editor/plugins/layout-plugin';
import { LinkPlugin } from '@/components/editor/plugins/link-plugin';
import { ListMaxIndentLevelPlugin } from '@/components/editor/plugins/list-max-indent-level-plugin';
import { MentionsPlugin } from '@/components/editor/plugins/mentions-plugin';
import { TabFocusPlugin } from '@/components/editor/plugins/tab-focus-plugin';
import { BlockFormatDropDown } from '@/components/editor/plugins/toolbar/block-format-toolbar-plugin';
import { FormatBulletedList } from '@/components/editor/plugins/toolbar/block-format/format-bulleted-list';
import { FormatCheckList } from '@/components/editor/plugins/toolbar/block-format/format-check-list';
import { FormatCodeBlock } from '@/components/editor/plugins/toolbar/block-format/format-code-block';
import { FormatHeading } from '@/components/editor/plugins/toolbar/block-format/format-heading';
import { FormatNumberedList } from '@/components/editor/plugins/toolbar/block-format/format-numbered-list';
import { FormatParagraph } from '@/components/editor/plugins/toolbar/block-format/format-paragraph';
import { FormatQuote } from '@/components/editor/plugins/toolbar/block-format/format-quote';
import { FontFormatToolbarPlugin } from '@/components/editor/plugins/toolbar/font-format-toolbar-plugin';
import { ToolbarPlugin } from '@/components/editor/plugins/toolbar/toolbar-plugin';
import { TypingPerfPlugin } from '@/components/editor/plugins/typing-pref-plugin';
import { EMOJI } from '@/components/editor/transformers/markdown-emoji-transformer';
import { HR } from '@/components/editor/transformers/markdown-hr-transformer';
import { IMAGE } from '@/components/editor/transformers/markdown-image-transformer';
import { TABLE } from '@/components/editor/transformers/markdown-table-transformer';
import { TWEET } from '@/components/editor/transformers/markdown-tweet-transformer';

const placeholder = 'Press / for commands...';
const maxLength = 500;

export function Plugins({}) {
    const [floatingAnchorElem, setFloatingAnchorElem] =
        useState<HTMLDivElement | null>(null);
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    return (
        <div className="relative">
            <ToolbarPlugin>
                {({ blockType }) => (
                    <div className="top-0 z-10 sticky flex items-center gap-2 p-1 border-b overflow-auto vertical-align-middle">
                        {/* <HistoryToolbarPlugin /> */}
                        {/* <Separator orientation="vertical" className="!h-7" /> */}
                        <BlockFormatDropDown>
                            <FormatParagraph />
                            <FormatHeading levels={['h1', 'h2', 'h3']} />
                            <FormatNumberedList />
                            <FormatBulletedList />
                            <FormatCheckList />
                            <FormatCodeBlock />
                            <FormatQuote />
                        </BlockFormatDropDown>
                        <FontFormatToolbarPlugin />

                        {/* {blockType === 'code' ? (
                            <CodeLanguageToolbarPlugin />
                        ) : (
                            <>
                                <FontFamilyToolbarPlugin />
                                <FontSizeToolbarPlugin />
                                <Separator
                                    orientation="vertical"
                                    className="!h-7"
                                />
                                <FontFormatToolbarPlugin />
                                <Separator
                                    orientation="vertical"
                                    className="!h-7"
                                />
                                <SubSuperToolbarPlugin />
                                <LinkToolbarPlugin
                                    setIsLinkEditMode={setIsLinkEditMode}
                                />
                                <Separator
                                    orientation="vertical"
                                    className="!h-7"
                                />
                                <ClearFormattingToolbarPlugin />
                                <Separator
                                    orientation="vertical"
                                    className="!h-7"
                                />
                                <FontColorToolbarPlugin />
                                <FontBackgroundToolbarPlugin />
                                <Separator
                                    orientation="vertical"
                                    className="!h-7"
                                />
                                <ElementFormatToolbarPlugin />
                                <Separator
                                    orientation="vertical"
                                    className="!h-7"
                                />
                                <BlockInsertPlugin>
                                    <InsertHorizontalRule />
                                    <InsertImage />
                                    <InsertTable />
                                    <InsertColumnsLayout />
                                    <InsertEmbeds />
                                </BlockInsertPlugin>
                            </>
                        )} */}
                    </div>
                )}
            </ToolbarPlugin>

            <div className="relative">
                <AutoFocusPlugin />
                <RichTextPlugin
                    contentEditable={
                        <div className="">
                            <div className="" ref={onRef}>
                                <ContentEditable
                                    placeholder={placeholder}
                                    className="block relative px-8 py-4 focus:outline-none h-[calc(100vh-90px)] min-h-72 overflow-auto ContentEditable__root"
                                />
                            </div>
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />

                <ClickableLinkPlugin />
                <CheckListPlugin />
                <HorizontalRulePlugin />
                <TablePlugin />
                <ListPlugin />
                <TabIndentationPlugin />
                <HashtagPlugin />
                <HistoryPlugin />

                <MentionsPlugin />
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <KeywordsPlugin />
                <EmojisPlugin />
                <ImagesPlugin />

                <LayoutPlugin />

                <AutoEmbedPlugin />
                <TwitterPlugin />
                <YouTubePlugin />

                <CodeHighlightPlugin />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />

                <MarkdownShortcutPlugin
                    transformers={[
                        TABLE,
                        HR,
                        IMAGE,
                        EMOJI,
                        TWEET,
                        CHECK_LIST,
                        ...ELEMENT_TRANSFORMERS,
                        ...MULTILINE_ELEMENT_TRANSFORMERS,
                        ...TEXT_FORMAT_TRANSFORMERS,
                        ...TEXT_MATCH_TRANSFORMERS,
                    ]}
                />
                <TypingPerfPlugin />
                <TabFocusPlugin />
                <AutocompletePlugin />
                <AutoLinkPlugin />
                <LinkPlugin />

                {/* <ComponentPickerMenuPlugin
                    baseOptions={[
                        ParagraphPickerPlugin(),
                        HeadingPickerPlugin({ n: 1 }),
                        HeadingPickerPlugin({ n: 2 }),
                        HeadingPickerPlugin({ n: 3 }),
                        TablePickerPlugin(),
                        CheckListPickerPlugin(),
                        NumberedListPickerPlugin(),
                        BulletedListPickerPlugin(),
                        QuotePickerPlugin(),
                        CodePickerPlugin(),
                        DividerPickerPlugin(),
                        EmbedsPickerPlugin({ embed: 'tweet' }),
                        EmbedsPickerPlugin({ embed: 'youtube-video' }),
                        ImagePickerPlugin(),
                        ColumnsLayoutPickerPlugin(),
                        AlignmentPickerPlugin({ alignment: 'left' }),
                        AlignmentPickerPlugin({ alignment: 'center' }),
                        AlignmentPickerPlugin({ alignment: 'right' }),
                        AlignmentPickerPlugin({ alignment: 'justify' }),
                    ]}
                    dynamicOptionsFn={DynamicTablePickerPlugin}
                /> */}

                <ContextMenuPlugin />
                <DragDropPastePlugin />
                <EmojiPickerPlugin />

                <FloatingLinkEditorPlugin
                    anchorElem={floatingAnchorElem}
                    isLinkEditMode={isLinkEditMode}
                    setIsLinkEditMode={setIsLinkEditMode}
                />
                <FloatingTextFormatToolbarPlugin
                    anchorElem={floatingAnchorElem}
                    setIsLinkEditMode={setIsLinkEditMode}
                />

                <ListMaxIndentLevelPlugin />
            </div>

            {/* <ActionsPlugin>
                <div className="clear-both flex justify-between items-center gap-2 p-1 border-t overflow-auto">
                    <div className="flex flex-1 justify-start">
                        <MaxLengthPlugin maxLength={maxLength} />
                        <CharacterLimitPlugin
                            maxLength={maxLength}
                            charset="UTF-16"
                        />
                    </div>
                    <div>
                        <CounterCharacterPlugin charset="UTF-16" />
                    </div>
                    <div className="flex flex-1 justify-end">
                        <SpeechToTextPlugin />
                        <ShareContentPlugin />
                        <ImportExportPlugin />
                        <MarkdownTogglePlugin
                            shouldPreserveNewLinesInMarkdown={true}
                            transformers={[
                                TABLE,
                                HR,
                                IMAGE,
                                EMOJI,
                                TWEET,
                                CHECK_LIST,
                                ...ELEMENT_TRANSFORMERS,
                                ...MULTILINE_ELEMENT_TRANSFORMERS,
                                ...TEXT_FORMAT_TRANSFORMERS,
                                ...TEXT_MATCH_TRANSFORMERS,
                            ]}
                        />
                        <EditModeTogglePlugin />
                        <>
                            <ClearEditorActionPlugin />
                            <ClearEditorPlugin />
                        </>
                        <TreeViewPlugin />
                    </div>
                </div>
            </ActionsPlugin> */}
        </div>
    );
}
