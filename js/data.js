// This file centralizes all data management for the app

class DataManager {
    constructor() {
        this.vocabularyData = vocabularyData || {};
        this.grammarRules = grammarRules || {};
        this.a2TestPrep = a2TestPrep || {};
        this.lessonContent = {
            beginner: [
                {
                    type: 'vocab',
                    word: 'restaurante',
                    portuguese: 'restaurante',
                    translation: 'restaurant',
                    usage: 'Vamos ao restaurante?',
                    englishUsage: 'Shall we go to the restaurant?',
                    category: 'daily life'
                },
                {
                    type: 'phrase',
                    portuguese: 'Quanto custa isto?',
                    translation: 'How much is this?',
                    usage: 'Shopping and prices',
                    audioUrl: 'quanto-custa.mp3'
                },
                {
                    type: 'vocab',
                    portuguese: 'comboio',
                    translation: 'train',
                    usage: 'European Portuguese uses "comboio" instead of "trem"',
                    category: 'transportation'
                },
                {
                    type: 'phrase',
