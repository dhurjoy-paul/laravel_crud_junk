import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { useState } from 'react';

import { ContentEditable } from '@/components/editor/editor-ui/content-editable';
import { AutoLinkPlugin } from '@/components/editor/plugins/auto-link-plugin';
import { AutocompletePlugin } from '@/components/editor/plugins/autocomplete-plugin';
import { ContextMenuPlugin } from '@/components/editor/plugins/context-menu-plugin';
import { DraggableBlockPlugin } from '@/components/editor/plugins/draggable-block-plugin';
import { EmojisPlugin } from '@/components/editor/plugins/emojis-plugin';
import { FloatingLinkEditorPlugin } from '@/components/editor/plugins/floating-link-editor-plugin';
import { FloatingTextFormatToolbarPlugin } from '@/components/editor/plugins/floating-text-format-plugin';
import { KeywordsPlugin } from '@/components/editor/plugins/keywords-plugin';
import { LayoutPlugin } from '@/components/editor/plugins/layout-plugin';
import { LinkPlugin } from '@/components/editor/plugins/link-plugin';
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

const placeholder = 'Press / for commands...';
// const maxLength = 500;

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
                    </div>
                )}
            </ToolbarPlugin>

            <div className="relative">
                {/* --- CORE SETUP --- */}
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
                {/* Puts the cursor in the editor automatically on page load */}
                <AutoFocusPlugin />
                {/* Enables Undo (Ctrl+Z) and Redo (Ctrl+Y) */}
                <HistoryPlugin />
                <ListPlugin /> {/* Enables Bulleted and Numbered lists */}
                <CheckListPlugin /> {/* Enables clickable Todo/Checklists */}
                {/* Allows adding divider lines (HR tags) */}
                <HorizontalRulePlugin />
                {/* Allows using the 'Tab' key to indent paragraphs or list items */}
                <TabIndentationPlugin />
                <LayoutPlugin /> {/* Enables multi-column section layouts */}
                {/* Automatically highlights #words as hashtags */}
                <HashtagPlugin />
                {/* Converts text like :) into visual emoji icons */}
                <EmojisPlugin />
                {/* Highlights specific search terms or internal keywords */}
                <KeywordsPlugin />
                <LinkPlugin /> {/* Basic support for manual hyperlinks */}
                {/* Automatically turns typed URLs (like www.google.com) into clickable links */}
                <AutoLinkPlugin />
                {/* Makes links clickable within the editor to open them */}
                <ClickableLinkPlugin />
                <FloatingLinkEditorPlugin
                    anchorElem={floatingAnchorElem}
                    isLinkEditMode={isLinkEditMode}
                    setIsLinkEditMode={setIsLinkEditMode}
                />
                {/* Adds a handle to drag/move blocks (like Notion) */}
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                {/* The popup menu (Bold/Italic/Link) that appears when you highlight text */}
                <FloatingTextFormatToolbarPlugin
                    anchorElem={floatingAnchorElem}
                    setIsLinkEditMode={setIsLinkEditMode}
                />
                {/* Enables custom actions when you right-click inside the editor */}
                <ContextMenuPlugin />
                {/* Provides "ghost text" suggestions while you type */}
                <AutocompletePlugin />
            </div>
        </div>
    );
}
